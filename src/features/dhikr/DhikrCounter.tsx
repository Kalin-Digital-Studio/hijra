import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Vibration, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, EmptyState, Input, ProgressBar } from '../../components/ui';
import { changeDhikrDraft, deleteDhikrDraft, readDhikrDisplayPreferences, readDhikrHaptics, saveDhikrDraft, writeDhikrDisplayPreference, writeDhikrHaptics, type DhikrDisplayPreferences } from '../../database/repositories/dhikr';
import { useTheme } from '../../hooks/useTheme';
import { readQuranFontSize } from '../../database/repositories/quranReader';
import { collectionStatus, completeStep, maxCount, type Draft } from '../../services/dhikrRules';
import { PrayerAction, PrayerModal, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { DhikrLoad, DhikrScreen, draftTitle } from './DhikrUI';
import { refreshDhikr, useDhikr } from './useDhikr';
import { DhikrReadingHelp } from './DhikrReadingHelp';

export default function DhikrCounter() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useTranslation();
  const { db, user, data } = useDhikr(useToday());
  const matching = data?.drafts.find((draft) => draft.id === id);
  if (matching && user) {
    const personal = !matching.collection && !!data?.items.find((item) => item.id === matching.steps[0].id)?.owner;
    return <Counter key={matching.id} initial={matching} db={db} user={user} personal={personal} />;
  }
  return <DhikrScreen title={t('dhikr.title')}>
    {!data ? <DhikrLoad failed={data === null} /> : <EmptyState message={t('dhikr.noDraft')} />}
  </DhikrScreen>;
}

function Counter({ initial, db, user, personal }: { initial: Draft; db: ReturnType<typeof useDhikr>['db']; user: string; personal: boolean }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const today = useToday();
  const [draft, setDraft] = useState(initial);
  const [readerSettingsOpen, setReaderSettingsOpen] = useState(false);
  const [display, setDisplay] = useState<DhikrDisplayPreferences>();
  const [displayError, setDisplayError] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [quranFont, setQuranFont] = useState<number>(30);
  const [target, setTarget] = useState(String(initial.steps[0].target ?? ''));
  const [manual, setManual] = useState('');
  const [haptic, setHaptic] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const pending = useRef(0);
  const displayWrites = useRef(new Set<keyof DhikrDisplayPreferences>());
  const lastHaptic = useRef(0);
  const blocked = useRef(false);
  const ticket = useRef(0);
  const durable = useRef(initial);
  const step = draft.steps[draft.current];
  const quranReading = step.id.startsWith('guided-surah-');
  const progress = draft.progress[draft.current];
  const status = collectionStatus(draft.steps, draft.progress);
  const started = draft.progress.some((value) => value.count > 0 || value.checked);

  useEffect(() => {
    let active = true;
    void readDhikrDisplayPreferences(db).then((value) => { if (active) setDisplay(value); }, () => { if (active) setDisplayError(true); });
    void readQuranFontSize(db).then((value) => { if (active) setQuranFont(value); }, () => undefined);
    void readDhikrHaptics(db).then((value) => { if (active) setHaptic(value); }, () => undefined);
    return () => { active = false; };
  }, [db]);

  function setHapticPreference(value: boolean) {
    void writeDhikrHaptics(db, value).then(() => setHaptic(value), () => setError(true));
  }

  function change(action: Parameters<typeof changeDhikrDraft>[3]) {
    if (blocked.current) return;
    pending.current++;
    setError(false);
    const operation = ++ticket.current;
    if (action.type === 'count') {
      setDraft((current) => ({
        ...current,
        progress: current.progress.map((value, index) => index === current.current
          ? { ...value, count: Math.max(0, Math.min(maxCount, value.count + action.delta)) } : value),
      }));
    }
    void changeDhikrDraft(db, user, draft.id, action).then((saved) => {
      durable.current = saved;
      if (operation === ticket.current) setDraft(saved);
    }, () => {
      setError(true);
      if (operation === ticket.current) setDraft(durable.current);
    });
    if (action.type === 'count' && action.delta === 1 && haptic) lastHaptic.current = tapVibration(lastHaptic.current);
  }

  async function finalize(remove = false, allowPartial = false) {
    if (blocked.current) return;
    blocked.current = true;
    setSaving(true);
    setError(false);
    try {
      if (remove) await deleteDhikrDraft(db, user, draft.id);
      else await saveDhikrDraft(db, user, draft.id, allowPartial);
      refreshDhikr();
      if (router.canGoBack()) router.back();
      else router.replace('/dhikr');
    } catch {
      setError(true);
    } finally {
      blocked.current = false;
      setSaving(false);
    }
  }

  function confirmSave() {
    if (draft.collection && !status.complete) {
      Alert.alert(t('dhikr.partial'), t('dhikr.partialHint'), [
        { text: t('quran.cancel'), style: 'cancel' },
        { text: t('dhikr.save'), onPress: () => void finalize(false, true) },
      ]);
    } else void finalize();
  }

  async function toggleDisplay(key: keyof DhikrDisplayPreferences, enabled: boolean) {
    if (!display || displayWrites.current.has(key)) return;
    displayWrites.current.add(key);
    setDisplayError(false);
    setDisplay((current) => current && { ...current, [key]: enabled });
    try {
      await writeDhikrDisplayPreference(db, key, enabled);
    } catch {
      setDisplay((current) => current && { ...current, [key]: !enabled });
      setDisplayError(true);
    } finally {
      displayWrites.current.delete(key);
    }
  }

  return <DhikrScreen title={draftTitle(t, draft)} action={
    <PrayerAction label={t('dhikr.readingSettings')} onPress={() => setReaderSettingsOpen(true)} />
  }>
    {readerSettingsOpen && <PrayerModal dismiss={() => setReaderSettingsOpen(false)}>
      <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('dhikr.readingSettings')}</BodyText>
      {display && <>
        <Checkbox label={t('dhikr.showLatin')} checked={display.latin} onChange={(enabled) => void toggleDisplay('latin', enabled)} />
        <Checkbox label={t('dhikr.showTranslation')} checked={display.translation} onChange={(enabled) => void toggleDisplay('translation', enabled)} />
      </>}
      {displayError && <BodyText accessibilityLiveRegion="polite">{t('dhikr.error')}</BodyText>}
      <BodyText style={prayerStyles.small}>{t('dhikr.latinHint')}</BodyText>
      <PrayerAction label={t('dhikr.closeReadingSettings')} onPress={() => setReaderSettingsOpen(false)} />
    </PrayerModal>}
    <PrayerPanel>
      <BodyText>{t('dhikr.recordDate', { date: draft.date })}{draft.context ? ` · ${t(`types.${draft.context}`)}` : ''}</BodyText>
      {draft.collection && <>
        <BodyText style={prayerStyles.section}>{t('dhikr.readingPosition', { current: draft.current + 1, total: draft.steps.length })}</BodyText>
        <BodyText>{t('dhikr.collectionProgress', status)}</BodyText>
        <ProgressBar label={t('dhikr.collectionProgress', status)} value={status.required ? status.completed / status.required * 100 : 0} />
        {draft.steps.length > 1 && <PrayerAction label={t(listOpen ? 'dhikr.hideReadings' : 'dhikr.readingList')} selected={listOpen}
          onPress={() => setListOpen((open) => !open)} />}
        {listOpen && draft.steps.map((item, index) => <PrayerAction key={`${item.id}-${index}`} selected={draft.current === index} disabled={saving}
          label={`${index + 1}. ${t(item.label)}${completeStep(item, draft.progress[index]) ? ' ✓' : ''}`}
          onPress={() => { change({ type: 'position', index }); setListOpen(false); }} />)}
      </>}
      <BodyText style={prayerStyles.section}>{t(step.label)}</BodyText>
      {!!step.arabic && (quranReading ? step.arabic.split('\n').map((ayah, index) => <View key={index}>
        <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{t('quran.ayahNumber', { value: index + 1 })}</BodyText>
        <BodyText accessibilityLanguage="ar" style={[styles.arabic, { fontSize: quranFont, lineHeight: Math.ceil(quranFont * 1.85) }]}>{ayah}</BodyText>
      </View>) : <BodyText accessibilityLanguage="ar" style={styles.arabic}>{step.arabic}</BodyText>)}
      {quranReading && <Pressable accessibilityRole="link" onPress={() => { void Linking.openURL('https://tanzil.net').catch(() => undefined); }}>
        <BodyText style={[prayerStyles.small, { color: colors.primary, textDecorationLine: 'underline' }]}>{t('dhikr.quranSource')}</BodyText>
      </Pressable>}
      <DhikrReadingHelp step={step} personal={personal} display={display} />
      {!!step.reference && <BodyText style={prayerStyles.small}>{t('dhikr.readingReference')} · {step.reference}</BodyText>}
      {step.mode === 'COUNTER' ? <>
        <Pressable accessibilityRole="button" accessibilityLabel={t('dhikr.increment')}
          accessibilityValue={{ text: String(progress.count) }} disabled={saving}
          onPress={() => change({ type: 'count', delta: 1 })} style={[styles.tap, { backgroundColor: colors.primary }]}>
          <BodyText style={[styles.count, { color: colors.onPrimary }]}>{progress.count}</BodyText>
          <BodyText style={{ color: colors.onPrimary }}>{t('dhikr.increment')}</BodyText>
        </Pressable>
        {step.target === null ? <BodyText>{t('dhikr.catalog.free')}</BodyText> : <>
          <BodyText>{t(draft.collection ? 'dhikr.narratedTarget' : 'dhikr.personalTarget', { target: step.target })}</BodyText>
          <BodyText>{t('dhikr.individualProgress', { count: progress.count, target: step.target })}</BodyText>
          <ProgressBar label={t('dhikr.individualProgress', { count: progress.count, target: step.target })} value={progress.count / step.target * 100} />
          {progress.count >= step.target && <BodyText>{t('dhikr.targetReached')}</BodyText>}
        </>}
        <View style={prayerStyles.wrap}>
          <PrayerAction disabled={saving || progress.count === 0} label={t('dhikr.decrement')} onPress={() => change({ type: 'count', delta: -1 })} />
          <PrayerAction disabled={saving} label={t('dhikr.reset')} onPress={() => Alert.alert(t('dhikr.reset'), t('dhikr.resetHint'), [
            { text: t('quran.cancel'), style: 'cancel' }, { text: t('dhikr.reset'), onPress: () => change({ type: 'reset' }) },
          ])} />
        </View>
        {!draft.collection && <View style={prayerStyles.wrap}>
          {[null, 33, 99, 100].map((preset) => <PrayerAction key={String(preset)} disabled={saving}
            selected={step.target === preset} label={preset === null ? t('dhikr.catalog.free') : String(preset)}
            onPress={() => { setTarget(String(preset ?? '')); change({ type: 'target', target: preset }); }} />)}
          <Input accessibilityLabel={t('dhikr.target')} value={target} onChangeText={setTarget} keyboardType="number-pad" maxLength={6} placeholder={t('dhikr.target')} />
          <PrayerAction disabled={saving || (!!target && (!/^\d+$/.test(target) || Number(target) < 1 || Number(target) > maxCount))}
            label={t('dhikr.setTarget')} onPress={() => change({ type: 'target', target: target ? Number(target) : null })} />
        </View>}
        {draft.date < today && <View style={prayerStyles.wrap}>
          <Input accessibilityLabel={t('dhikr.actualCount')} value={manual} onChangeText={setManual} keyboardType="number-pad" maxLength={6} placeholder={t('dhikr.actualCount')} />
          <PrayerAction disabled={saving || !/^\d+$/.test(manual)} label={t('dhikr.apply')} onPress={() => change({ type: 'manual', count: Number(manual) })} />
        </View>}
        {Platform.OS === 'android' && <Checkbox label={t('dhikr.haptic')} checked={haptic} onChange={setHapticPreference} />}
      </> : <>
        <BodyText style={prayerStyles.small}>{t('dhikr.applicationChecklist')}</BodyText>
        <Checkbox label={t('dhikr.checked')} checked={progress.checked} onChange={() => change({ type: 'check' })} />
      </>}
    </PrayerPanel>
    {draft.collection && draft.steps.length > 1 && <View style={styles.readingNavigation}>
      {([-1, 1] as const).map((delta) => {
        const index = draft.current + delta;
        const adjacent = draft.steps[index];
        const label = t(delta === -1 ? 'dhikr.previousReading' : 'dhikr.nextReading');
        return <PrayerAction key={delta} disabled={saving || !adjacent}
          label={adjacent ? `${label} · ${t(adjacent.label)}` : label}
          onPress={() => change({ type: 'position', index })} />;
      })}
    </View>}
    {error && <BodyText accessibilityLiveRegion="polite">{t('dhikr.error')}</BodyText>}
    <PrayerAction emphasis="primary" label={t('dhikr.save')} disabled={saving || !started} onPress={confirmSave} />
    <PrayerAction emphasis="danger" label={t('dhikr.discard')} disabled={saving} onPress={() => Alert.alert(t('dhikr.discard'), t('dhikr.discardHint'), [
      { text: t('quran.cancel'), style: 'cancel' }, { text: t('dhikr.discard'), style: 'destructive', onPress: () => void finalize(true) },
    ])} />
  </DhikrScreen>;
}

function tapVibration(previous: number) {
  const now = Date.now();
  if (Platform.OS !== 'android' || now - previous < 100) return previous;
  try { Vibration.vibrate(15); } catch { /* Optional device feedback. */ }
  return now;
}

const styles = StyleSheet.create({
  readingNavigation: { gap: 8 },
  arabic: { fontSize: 32, lineHeight: 55, textAlign: 'right', writingDirection: 'rtl' },
  tap: { minHeight: 116, borderRadius: 38, alignItems: 'center', justifyContent: 'center', padding: 12 },
  count: { fontSize: 42, lineHeight: 52, fontWeight: '700' },
});
