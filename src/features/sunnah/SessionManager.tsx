import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Input } from '../../components/ui';
import { newSunnahId, removeSunnahSession, saveSunnahSession } from '../../services/sunnah';
import { maxSunnahNotes, optionalRakaat } from '../../services/sunnahRules';
import { space } from '../../theme/tokens';
import type { SunnahActivity, SunnahSession, SunnahTarget } from '../../types/sunnah';
import { parseLocalDate } from '../../utils/localDate';
import { PrayerAction, PrayerModal, prayerStyles } from '../prayer/PrayerUI';
import { activityName, sunnahError } from './SunnahUI';
import { refreshSunnah } from './useSunnah';

type Draft = { id: string; editing: boolean; rakaat: string; time: string; notes: string };
export function SessionManager({ activity, target, sessions, dismiss }: {
  activity: SunnahActivity; target: SunnahTarget; sessions: readonly SunnahSession[]; dismiss: () => void;
}) {
  const { t, i18n } = useTranslation();
  const db = useSQLiteContext();
  const [draft, setDraft] = useState<Draft>();
  const [error, setError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'full' }).format(parseLocalDate(target.date)!);
  function edit(session?: SunnahSession) {
    setError(undefined);
    setDraft({
      id: session?.id ?? newSunnahId('session'), editing: !!session,
      rakaat: String((session ? session.rakaat : activity.defaultRakaat) ?? ''),
      time: session?.prayerTime ?? '', notes: session?.notes ?? '',
    });
  }
  async function run(operation: () => Promise<unknown>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(undefined);
    try {
      await operation();
      refreshSunnah();
      setDraft(undefined);
    } catch (cause) {
      setError(cause);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function remove(id: string) {
    Alert.alert(t('sunnah.deleteSession'), t('sunnah.confirmDelete'), [
      { text: t('prayer.cancel'), style: 'cancel' },
      { text: t('sunnah.deleteSession'), style: 'destructive', onPress: () => void run(() => removeSunnahSession(db, target, id)) },
    ]);
  }
  function close() {
    if (!lock.current) dismiss();
  }
  return (
    <PrayerModal dismiss={close}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll} contentContainerStyle={styles.content}>
          <BodyText accessibilityRole="header" style={prayerStyles.section}>{activityName(t, activity)}</BodyText>
          <BodyText style={prayerStyles.small}>{date}</BodyText>
          {!!error && <BodyText accessibilityLiveRegion="polite">{sunnahError(t, error)}</BodyText>}
          {draft ? <>
            <BodyText style={prayerStyles.section}>{t(draft.editing ? 'sunnah.editSession' : 'sunnah.addSession')}</BodyText>
            <BodyText style={prayerStyles.small}>{t('sunnah.rakaat')}</BodyText>
            <Input accessibilityLabel={t('sunnah.rakaat')} keyboardType="number-pad" maxLength={6} value={draft.rakaat} editable={!busy}
              onChangeText={(rakaat) => setDraft({ ...draft, rakaat })} />
            <BodyText style={prayerStyles.small}>{t('sunnah.time')}</BodyText>
            <Input accessibilityLabel={t('sunnah.time')} placeholder="00:00" maxLength={5} value={draft.time}
              editable={!busy} onChangeText={(time) => setDraft({ ...draft, time })} />
            <BodyText style={prayerStyles.small}>{t('sunnah.notes')}</BodyText>
            <Input accessibilityLabel={t('sunnah.notes')} multiline maxLength={maxSunnahNotes} value={draft.notes}
              editable={!busy} onChangeText={(notes) => setDraft({ ...draft, notes })} style={styles.notes} />
            <View style={prayerStyles.wrap}>
              <PrayerAction disabled={busy} label={t(busy ? 'sunnah.saving' : 'prayer.save')} onPress={() => void run(() =>
                saveSunnahSession(db, target, draft.id, { rakaat: optionalRakaat(draft.rakaat), prayerTime: draft.time, notes: draft.notes }, draft.editing))} />
              {draft.editing && <PrayerAction disabled={busy} label={t('sunnah.deleteSession')} onPress={() => remove(draft.id)} />}
              <PrayerAction disabled={busy} label={t('prayer.cancel')} onPress={() => { setDraft(undefined); setError(undefined); }} />
            </View>
          </> : <>
            {!sessions.length && <BodyText style={prayerStyles.small}>{t('sunnah.noRecords')}</BodyText>}
            {sessions.map((session, index) => <View key={session.id} style={styles.session}>
              <BodyText style={prayerStyles.section}>{t('sunnah.session', { number: index + 1 })}</BodyText>
              <BodyText style={prayerStyles.small}>{session.rakaat === null ? t('sunnah.noRakaat') : t('sunnah.rakaatCount', { count: session.rakaat })}
                {session.prayerTime ? ` · ${session.prayerTime}` : ''}</BodyText>
              {session.notes && <BodyText style={prayerStyles.small}>{session.notes}</BodyText>}
              <View style={prayerStyles.wrap}>
                <PrayerAction disabled={busy} label={t('sunnah.editSession')} onPress={() => edit(session)} />
                <PrayerAction disabled={busy} label={t('sunnah.deleteSession')} onPress={() => remove(session.id)} />
              </View>
            </View>)}
            <View style={prayerStyles.wrap}>
              {activity.active && <PrayerAction disabled={busy} label={t('sunnah.addSession')} onPress={() => edit()} />}
              <PrayerAction disabled={busy} label={t('back')} onPress={close} />
            </View>
          </>}
        </ScrollView>
      </KeyboardAvoidingView>
    </PrayerModal>
  );
}
const styles = StyleSheet.create({
  scroll: { maxHeight: '90%' },
  content: { gap: space.sm },
  session: { gap: space.xs },
  notes: { minHeight: 72, textAlignVertical: 'top' },
});
