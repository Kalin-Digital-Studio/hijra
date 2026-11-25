import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { quickRecordSunnah, removeSunnahSession } from '../../services/sunnah';
import { summarizeSunnah } from '../../services/sunnahRules';
import { radius } from '../../theme/tokens';
import type { SunnahActivity, SunnahSession, SunnahTarget } from '../../types/sunnah';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { SessionManager } from './SessionManager';
import { activityName, sunnahError } from './SunnahUI';
import { refreshSunnah } from './useSunnah';

export function SunnahActivityCard({ activity, target, sessions }: {
  activity: SunnahActivity; target: SunnahTarget; sessions: readonly SunnahSession[];
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<unknown>();
  const [managing, setManaging] = useState(false);
  const lock = useRef(false);
  const title = activityName(t, activity);
  const recorded = sessions.length > 0;
  const summary = summarizeSunnah(sessions);
  const icon = activity.custom ? 'heart' : activity.id === 'wudhu' ? 'droplet' : activity.id === 'tahiyyat-al-masjid' ? 'building' :
    activity.id.includes('fajr') ? 'fajr' : activity.id.includes('maghrib') ? 'maghrib' : activity.id.includes('asr') ? 'asr' :
    activity.id === 'duha' || activity.id.includes('dhuhr') ? 'dhuhr' : activity.id === 'tahajjud' ? 'isha' : 'moon';

  async function save(action: () => Promise<unknown>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setSaved(false);
    setError(undefined);
    try {
      await action();
      refreshSunnah();
      setSaved(true);
    } catch (cause) {
      setError(cause);
      refreshSunnah();
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  function toggle() {
    if (lock.current) return;
    if (!recorded) {
      if (activity.active) void save(() => quickRecordSunnah(db, target));
      return;
    }
    if (sessions.length > 1) {
      setManaging(true);
      return;
    }
    const session = sessions[0];
    if (session.rakaat !== null || session.prayerTime || session.notes) {
      Alert.alert(t('sunnah.deleteSession'), t('sunnah.confirmDelete'), [
        { text: t('prayer.cancel'), style: 'cancel' },
        { text: t('sunnah.deleteSession'), style: 'destructive', onPress: () => void save(() => removeSunnahSession(db, target, session.id, true, true)) },
      ]);
    } else {
      void save(() => removeSunnahSession(db, target, session.id, true));
    }
  }

  return (
    <PrayerPanel>
      <View style={prayerStyles.line}>
        <View style={[styles.icon, { backgroundColor: colors.selected }]}>
          <PrayerIcon kind={icon} color={colors.primary} background={colors.selected} />
        </View>
        <View style={styles.details}>
          <BodyText style={prayerStyles.section}>{title}</BodyText>
          <BodyText style={[prayerStyles.small, { color: colors.muted }]}>
            {recorded ? `${t('sunnah.sessionCount', { count: sessions.length })} · ${summary.recordedRakaat === null
              ? t('sunnah.noRakaat') : t('sunnah.rakaatCount', { count: summary.recordedRakaat })}` : t('sunnah.notLogged')}
          </BodyText>
        </View>
        <Pressable accessibilityRole="checkbox" accessibilityLabel={title} accessibilityState={{ checked: recorded, disabled: busy }}
          disabled={busy} onPress={toggle} style={styles.touch}>
          <View style={[styles.checkbox, { borderColor: colors.primary, backgroundColor: recorded ? colors.selected : colors.surface }]}>
            {recorded && <PrayerIcon kind="COMPLETED" size={19} color={colors.primary} background={colors.selected} />}
          </View>
        </Pressable>
        <PrayerAction icon="more" label={t('prayer.actions', { prayer: title })} disabled={busy} onPress={() => setManaging(true)} />
      </View>
      {(busy || saved || !!error) && <BodyText accessibilityLiveRegion="polite" style={prayerStyles.small}>
        {error ? sunnahError(t, error) : t(busy ? 'sunnah.saving' : 'sunnah.saved')}
      </BodyText>}
      {managing && <SessionManager activity={activity} target={target} sessions={sessions} dismiss={() => setManaging(false)} />}
    </PrayerPanel>
  );
}

const styles = StyleSheet.create({
  icon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1 },
  touch: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  checkbox: { width: 23, height: 23, borderWidth: 1.5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
});
