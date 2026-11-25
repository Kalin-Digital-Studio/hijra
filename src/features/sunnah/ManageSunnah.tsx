import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input, LoadingState, ScreenContainer } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { cleanCustomName, newSunnahId, saveSunnahPreferences } from '../../services/sunnah';
import { optionalRakaat } from '../../services/sunnahRules';
import { space } from '../../theme/tokens';
import type { SunnahActivity } from '../../types/sunnah';
import { PrayerAction, PrayerModal, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { activityName, sunnahError } from './SunnahUI';
import { refreshSunnah, useSunnahData } from './useSunnah';

type ActivityEdit = { activity: SunnahActivity; rakaat: string };

export default function ManageSunnah() {
  const { data, userId } = useSunnahData();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const router = useRouter();
  const [draft, setDraft] = useState<SunnahActivity[]>();
  const [edit, setEdit] = useState<ActivityEdit>();
  const [error, setError] = useState<unknown>();
  const [editError, setEditError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  const list = draft ?? data?.activities ?? [];
  const active = list.filter((item) => item.active).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const nextOrder = Math.max(-1, ...active.map((item) => item.order)) + 1;
  const back = () => {
    if (lock.current) return;
    if (router.canGoBack()) router.back(); else router.replace('/sunnah');
  };

  function patch(activity: SunnahActivity) {
    setDraft((previous) => {
      const base = previous ?? list;
      return base.some((item) => item.id === activity.id) ? base.map((item) => item.id === activity.id ? activity : item) : [...base, activity];
    });
  }

  function move(index: number, offset: number) {
    const next = [...active];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    const order = new Map(next.map((activity, position) => [activity.id, position]));
    setDraft(list.map((activity) => activity.active ? { ...activity, order: order.get(activity.id)! } : activity));
  }

  function openEdit(activity?: SunnahActivity) {
    const current = activity ?? {
      id: newSunnahId('activity'), custom: true, active: true, description: null, name: '', order: nextOrder, defaultRakaat: null,
    };
    setEditError(undefined);
    setEdit({ activity: current, rakaat: String(current.defaultRakaat ?? '') });
  }

  function applyEdit() {
    if (!edit) return;
    try {
      const activity = edit.activity;
      const info = activity.custom ? cleanCustomName(activity.name ?? '', activity.description) : {};
      patch({ ...activity, ...info, defaultRakaat: optionalRakaat(edit.rakaat) });
      setEdit(undefined);
    } catch (cause) {
      setEditError(cause);
    }
  }

  async function save() {
    if (!userId || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(undefined);
    try {
      await saveSunnahPreferences(db, userId, draft ?? []);
      refreshSunnah();
      lock.current = false;
      back();
    } catch (cause) {
      setError(cause);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  const groups = [
    { key: 'general', items: list.filter((a) => !a.custom && !/^(before|after)-/.test(a.id)) },
    { key: 'related', items: list.filter((a) => !a.custom && /^(before|after)-/.test(a.id)) },
    { key: 'custom', items: list.filter((a) => a.custom) },
  ];

  return (
    <ScreenContainer standalone compact>
      <View style={prayerStyles.line}>
        <PrayerAction icon="back" label={t('back')} onPress={back} disabled={busy} />
        <BodyText accessibilityRole="header" style={prayerStyles.title}>{t('sunnah.manage')}</BodyText>
      </View>
      <BodyText style={prayerStyles.small}>{t('sunnah.choose')}</BodyText>
      {!!error && <EmptyState message={sunnahError(t, error)} />}
      {data ? <>
        {groups.map(({ key, items }) => <PrayerPanel key={key}>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t(`sunnah.${key}`)}</BodyText>
          {items.map((activity) => <View key={activity.id} style={[styles.row, { borderColor: colors.border }]}>
            <View style={styles.detail}>
              <BodyText style={prayerStyles.small}>{activityName(t, activity)}</BodyText>
              {activity.description && <BodyText style={prayerStyles.small}>{activity.description}</BodyText>}
              <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{activity.defaultRakaat === null ? t('sunnah.noRakaat') :
                `${t('sunnah.defaultRakaat')} · ${activity.defaultRakaat}`}</BodyText>
            </View>
            <Switch accessibilityLabel={activityName(t, activity)} disabled={busy} value={activity.active} onValueChange={(value) =>
              patch({ ...activity, active: value, order: value ? nextOrder : activity.order })} />
            <PrayerAction icon="more" label={t(activity.custom ? 'sunnah.editCustom' : 'sunnah.defaultRakaat')} onPress={() => openEdit(activity)} disabled={busy} />
          </View>)}
          {key === 'custom' && <PrayerAction label={t('sunnah.addCustom')} onPress={() => openEdit()} disabled={busy} />}
        </PrayerPanel>)}
        {!!active.length && <PrayerPanel>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('sunnah.mine')}</BodyText>
          {active.map((activity, index) => <View key={activity.id} style={styles.row}>
            <BodyText style={[styles.detail, prayerStyles.small]}>{index + 1}. {activityName(t, activity)}</BodyText>
            <PrayerAction icon="up" label={t('sunnah.movingUp', { name: activityName(t, activity) })} disabled={busy || !index} onPress={() => move(index, -1)} />
            <PrayerAction icon="down" label={t('sunnah.movingDown', { name: activityName(t, activity) })} disabled={busy || index === active.length - 1} onPress={() => move(index, 1)} />
          </View>)}
        </PrayerPanel>}
        <PrayerAction label={t(busy ? 'sunnah.saving' : 'sunnah.savePreferences')} disabled={busy} onPress={() => void save()} />
        <PrayerAction label={t('prayer.cancel')} disabled={busy} onPress={back} />
      </> : data === null ? <>
        <EmptyState message={t('loadError')} /><PrayerAction label={t('retry')} onPress={refreshSunnah} />
      </> : <LoadingState />}
      {edit && <PrayerModal dismiss={() => setEdit(undefined)}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.editor}>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{t(edit.activity.custom ? 'sunnah.editCustom' : 'sunnah.defaultRakaat')}</BodyText>
          {!!editError && <EmptyState message={sunnahError(t, editError)} />}
          {edit.activity.custom && <>
            <Input accessibilityLabel={t('sunnah.activityName')} placeholder={t('sunnah.activityName')} maxLength={120} value={edit.activity.name ?? ''}
              onChangeText={(name) => setEdit({ ...edit, activity: { ...edit.activity, name } })} />
            <Input accessibilityLabel={t('sunnah.description')} placeholder={t('sunnah.description')} multiline maxLength={300} value={edit.activity.description ?? ''}
              onChangeText={(description) => setEdit({ ...edit, activity: { ...edit.activity, description } })} />
          </>}
          <BodyText style={prayerStyles.small}>{t('sunnah.defaultRakaat')}</BodyText>
          <Input accessibilityLabel={t('sunnah.defaultRakaat')} keyboardType="number-pad" maxLength={6}
            value={edit.rakaat} onChangeText={(rakaat) => setEdit({ ...edit, rakaat })} />
          <View style={prayerStyles.wrap}>
            <PrayerAction label={t('sunnah.applyDraft')} onPress={applyEdit} />
            <PrayerAction label={t('prayer.cancel')} onPress={() => setEdit(undefined)} />
          </View>
        </ScrollView>
      </PrayerModal>}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingVertical: space.xs, borderBottomWidth: StyleSheet.hairlineWidth },
  detail: { flex: 1, gap: 3 },
  editor: { gap: space.sm },
});
