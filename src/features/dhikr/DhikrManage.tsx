import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, Input } from '../../components/ui';
import { reorderDhikr, saveCustomDhikr, saveDhikrPreference } from '../../database/repositories/dhikr';
import { maxCount, newDhikrId, type DhikrItem } from '../../services/dhikrRules';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { DhikrLoad, DhikrScreen } from './DhikrUI';
import { refreshDhikr, useDhikr } from './useDhikr';

export default function DhikrManage() {
  const { t } = useTranslation();
  const { db, user, data } = useDhikr(useToday());
  const [draft, setDraft] = useState<DhikrItem>();
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function run(work: () => Promise<unknown>, close = false) {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      await work();
      refreshDhikr();
      if (close) setDraft(undefined);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  function open(item?: DhikrItem) {
    setTarget(String(item?.target ?? ''));
    setDraft(item ?? { id: newDhikrId(), label: '', arabic: null, latin: null, meaning: null, notes: null,
      reference: null, mode: 'COUNTER', target: null, owner: user ?? null, archived: 0, favorite: 0, sort: 0 });
  }

  const valid = !target || (/^\d+$/.test(target) && Number(target) > 0 && Number(target) <= maxCount);
  return <DhikrScreen title={t('dhikr.manage')}>
    {error && <BodyText accessibilityLiveRegion="polite">{t('dhikr.error')}</BodyText>}
    {!data || !user ? <DhikrLoad failed={data === null} /> : draft ? <PrayerPanel>
      <BodyText>{t('dhikr.personalHint')}</BodyText>
      <Input accessibilityLabel={t('dhikr.name')} placeholder={t('dhikr.name')} value={draft.label} maxLength={80}
        onChangeText={(label) => setDraft({ ...draft, label })} />
      {(['arabic', 'latin', 'meaning', 'notes'] as const).map((field) => <Input key={field} accessibilityLabel={t(`dhikr.${field}`)}
        placeholder={t(`dhikr.${field}`)} value={draft[field] ?? ''} multiline maxLength={1000}
        onChangeText={(value) => setDraft({ ...draft, [field]: value || null })} />)}
      <View style={prayerStyles.wrap}>
        {(['COUNTER', 'CHECKLIST'] as const).map((mode) => <PrayerAction key={mode} label={t(`dhikr.${mode}`)} selected={draft.mode === mode}
          onPress={() => setDraft({ ...draft, mode })} />)}
      </View>
      {draft.mode === 'COUNTER' && <Input accessibilityLabel={t('dhikr.target')} placeholder={t('dhikr.target')} value={target}
        onChangeText={setTarget} keyboardType="number-pad" maxLength={6} />}
      <Checkbox label={t('dhikr.active')} checked={!draft.archived} onChange={(active) => setDraft({ ...draft, archived: active ? 0 : 1 })} />
      <PrayerAction emphasis="primary" label={t('dhikr.save')} disabled={busy || !draft.label.trim() || (draft.mode === 'COUNTER' && !valid)}
        onPress={() => void run(() => saveCustomDhikr(db, user, { ...draft, target: draft.mode === 'COUNTER' && target ? Number(target) : null }), true)} />
      <PrayerAction label={t('quran.cancel')} disabled={busy} onPress={() => setDraft(undefined)} />
    </PrayerPanel> : <>
      <PrayerAction label={t('dhikr.create')} onPress={() => open()} />
      {data.items.filter((item) => item.id !== 'closing' && !item.id.startsWith('guided-')).map((item, index, items) => <PrayerPanel key={item.id}>
        <BodyText style={prayerStyles.section}>{item.owner ? item.label : t(item.label)}</BodyText>
        {!!item.archived && <BodyText>{t('dhikr.inactive')}</BodyText>}
        <View style={prayerStyles.wrap}>
          <PrayerAction selected={!!item.favorite} disabled={busy} label={t('dhikr.favorite')}
            onPress={() => void run(() => saveDhikrPreference(db, user, item.id, Number(!item.favorite), item.sort))} />
          <PrayerAction icon="up" disabled={busy || index === 0} label={t('dhikr.moveUp')}
            onPress={() => void run(async () => {
              const order = items.map(({ id }) => id);
              [order[index - 1], order[index]] = [order[index], order[index - 1]];
              await reorderDhikr(db, user, order);
            })} />
          {item.owner && <PrayerAction label={t('dhikr.edit')} onPress={() => open(item)} />}
        </View>
      </PrayerPanel>)}
    </>}
  </DhikrScreen>;
}
