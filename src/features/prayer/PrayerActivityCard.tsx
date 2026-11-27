import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Input } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { applyPrayerChange, maxPrayerNoteLength } from '../../services/prayerRules';
import { radius, space } from '../../theme/tokens';
import { prayerStatuses, type PrayerChange, type PrayerDay, type PrayerId } from '../../types/prayer';
import { PrayerIcon } from './PrayerIcon';
import { PrayerAction, PrayerModal, PrayerPanel, prayerStyles } from './PrayerUI';

export function PrayerActivityCard({ id, date, record, save }: {
  id: PrayerId; date: string; record: PrayerDay; save: (change: PrayerChange) => Promise<PrayerDay>;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [menu, setMenu] = useState<'status' | 'notes'>();
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<'saving' | 'saved' | 'saveError' |
    'savedOnTimeYes' | 'savedOnTimeNo' | 'savedOnTimeUnspecified' |
    'savedCongregationalYes' | 'savedCongregationalNo' | 'savedCongregationalUnspecified'>();
  const [draft, setDraft] = useState<{ base: PrayerDay; value: PrayerDay }>();
  const intent = useRef(0);
  const pending = useRef<PrayerDay | undefined>(undefined);
  const failed = useRef<PrayerChange | undefined>(undefined);
  const displayed = draft && (feedback === 'saving' || draft.base === record) ? draft.value : record;
  const title = t(`types.${id}`);

  async function submit(change: PrayerChange) {
    let next: PrayerDay;
    try {
      next = applyPrayerChange(pending.current ?? displayed, change);
    } catch {
      failed.current = change;
      setFeedback('saveError');
      return;
    }
    const ticket = ++intent.current;
    pending.current = next;
    setDraft({ base: record, value: next });
    setFeedback('saving');
    try {
      const saved = await save(change);
      if (ticket === intent.current) {
        pending.current = undefined;
        failed.current = undefined;
        setDraft({ base: record, value: saved });
        if (change.type === 'attribute') {
          const value = saved[change.field];
          const attribute = change.field === 'onTime' ? 'OnTime' : 'Congregational';
          const answer = value === null ? 'Unspecified' : value ? 'Yes' : 'No';
          setFeedback(`saved${attribute}${answer}`);
        } else {
          setFeedback('saved');
        }
      }
    } catch {
      if (ticket === intent.current) {
        pending.current = undefined;
        failed.current = change;
        setDraft(undefined);
        setFeedback('saveError');
      }
    }
  }

  const completed = displayed.status === 'COMPLETED';
  return (
    <PrayerPanel>
      <View style={prayerStyles.line}>
        <View style={[styles.icon, { backgroundColor: colors.selected }]}><PrayerIcon kind={id} color={colors.primary} background={colors.selected} /></View>
        <View style={styles.details}>
          <BodyText style={prayerStyles.section}>{title}</BodyText>
          <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{t(`prayer.status.${displayed.status}`)}</BodyText>
        </View>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: completed }}
          accessibilityLabel={`${title} · ${t('prayer.status.COMPLETED')}`}
          onPress={() => void submit({ type: 'status', value: (pending.current ?? displayed).status === 'COMPLETED' ? 'NOT_LOGGED' : 'COMPLETED' })}
          style={styles.checkbox}>
          <View style={[styles.tickBox, { borderColor: completed ? colors.primary : colors.muted, backgroundColor: completed ? colors.selected : colors.surface }]}>
            {completed && <PrayerIcon kind="COMPLETED" color={colors.primary} background={colors.selected} size={20} />}
          </View>
        </Pressable>
        <PrayerAction label={t('prayer.actions', { prayer: title })} icon="more" onPress={() => setMenu('status')} />
      </View>
      {completed && <View style={prayerStyles.wrap}>
        {(['onTime', 'congregational'] as const).map((field) => {
          const current = displayed[field];
          const state = t(current === null ? 'prayer.unspecified' : current ? 'prayer.yes' : 'prayer.no');
          return <PrayerAction key={field} label={`${t(`prayer.${field}`)} · ${state}`} onPress={() => {
            const latest = (pending.current ?? displayed)[field];
            void submit({ type: 'attribute', field, value: latest === null ? true : latest ? false : null });
          }} />;
        })}
        <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{t('prayer.attributeHint')}</BodyText>
      </View>}
      {completed && <PrayerAction label={t('dhikr.post')}
        onPress={() => router.push({ pathname: '/dhikr', params: { prayer: id, date } })} />}
      {feedback && <BodyText accessibilityLiveRegion="polite" style={prayerStyles.small}>{t(`prayer.${feedback}`)}</BodyText>}
      {feedback === 'saveError' && <PrayerAction label={t('retry')} onPress={() => {
        if (failed.current) void submit(failed.current);
      }} />}
      {menu === 'status' && <PrayerModal dismiss={() => setMenu(undefined)}>
        <BodyText style={prayerStyles.section}>{title}</BodyText>
        <ScrollView style={styles.options} contentContainerStyle={styles.optionsContent}>
          {prayerStatuses.map((status) => <PrayerAction key={status} label={t(`prayer.status.${status}`)}
            selected={displayed.status === status} onPress={() => { setMenu(undefined); void submit({ type: 'status', value: status }); }} />)}
          <PrayerAction label={t('prayer.notes')} onPress={() => { setNotes(displayed.notes ?? ''); setMenu('notes'); }} />
          <PrayerAction label={t('prayer.cancel')} onPress={() => setMenu(undefined)} />
        </ScrollView>
      </PrayerModal>}
      {menu === 'notes' && <PrayerModal dismiss={() => setMenu(undefined)}>
        <BodyText style={prayerStyles.section}>{t('prayer.notes')} · {title}</BodyText>
        <Input multiline maxLength={maxPrayerNoteLength} accessibilityLabel={t('prayer.notes')} placeholder={t('prayer.notePlaceholder')}
          value={notes} onChangeText={setNotes} style={styles.notes} />
        <View style={prayerStyles.wrap}>
          <PrayerAction label={t('prayer.save')} onPress={() => { setMenu(undefined); void submit({ type: 'notes', value: notes }); }} />
          {displayed.notes && <PrayerAction label={t('prayer.removeNote')} onPress={() => { setMenu(undefined); void submit({ type: 'notes', value: '' }); }} />}
          <PrayerAction label={t('prayer.cancel')} onPress={() => setMenu(undefined)} />
        </View>
      </PrayerModal>}
    </PrayerPanel>
  );
}
const styles = StyleSheet.create({
  icon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1 },
  checkbox: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  tickBox: { width: 23, height: 23, borderWidth: 1.5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  options: { maxHeight: 380 },
  optionsContent: { gap: space.sm },
});
