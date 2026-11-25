import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, EmptyState, Input, ScreenContainer } from '../../components/ui';
import { productName } from '../../constants/application';
import { useTheme } from '../../hooks/useTheme';
import { persistProfile } from '../../services/profile';
import { useProfile } from '../../stores/profile';
import { useSettings } from '../../stores/settings';
import { radius, space, typography } from '../../theme/tokens';
import { genders, validDisplayName, type Gender } from '../../types/profile';
import type { Settings } from '../../types/settings';
import { avatarSource, discardAvatar, prepareAvatar } from './avatar';
import { PreferenceOptions } from './Preferences';
import { ProfileAvatar } from './ProfileAvatar';

export function ProfileForm({ setup = false }: { setup?: boolean }) {
  const router = useRouter();
  const db = useSQLiteContext();
  const language = setup ? 'id' : undefined;
  const { t, i18n } = useTranslation(undefined, { lng: language });
  const { colors } = useTheme();
  const profile = useProfile((state) => state.profile);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [gender, setGender] = useState<Gender>(profile?.gender ?? null);
  const [reference, setReference] = useState(profile?.avatarUri ?? null);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();
  const [preferences, setPreferences] = useState<Settings>(() => useSettings.getState());
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<'theme' | 'week_start'>();
  const lock = useRef(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => lock.current);
    return () => subscription.remove();
  }, []);

  function close() {
    if (router.canGoBack()) router.back();
    else if (!setup) router.replace('/profile');
  }

  async function choosePhoto() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(undefined);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled) setPhoto(result.assets[0]);
    } catch {
      setError('personal.photoError');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  async function save() {
    if (lock.current) return;
    if (!validDisplayName(displayName)) {
      setError('personal.nameError');
      return;
    }
    lock.current = true;
    setBusy(true);
    setError(undefined);
    let staged: string | null = null;
    try {
      if (photo) {
        try {
          staged = await prepareAvatar(photo);
        } catch {
          setError('personal.photoSaveError');
          return;
        }
      }
      const { profile: saved, settings: { completed, ...settings } } = await persistProfile(
        db, profile?.id ?? null, { displayName, gender, avatarUri: staged ?? reference }, setup ? preferences : undefined,
      );
      staged = null;
      if (profile?.avatarUri && profile.avatarUri !== saved.avatarUri) discardAvatar(profile.avatarUri);
      useSettings.setState(settings);
      void i18n.changeLanguage(settings.language);
      useProfile.setState({ profile: saved, completed });
      if (!setup) close();
    } catch {
      discardAvatar(staged);
      setError('settings.saveError');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  const avatar = <ProfileAvatar uri={photo?.uri ?? avatarSource(reference)} name={displayName} language={language} />;
  const nameInput = <Input accessibilityLabel={t('personal.name')} placeholder={t(setup ? 'personal.namePlaceholder' : 'personal.name')}
    value={displayName} onChangeText={setDisplayName} editable={!busy} autoComplete="nickname" autoCapitalize="words" maxLength={120}
    style={[styles.small, { backgroundColor: colors.surface }]} />;
  function removePhoto() {
    setPhoto(undefined);
    setReference(null);
  }

  return (
    <ScreenContainer standalone={setup} keyboard>
      <View style={styles.topBar}>
        {(!setup || router.canGoBack()) && <Pressable accessibilityRole="button" accessibilityLabel={t('back')} disabled={busy} onPress={close} style={styles.back}>
          <BodyText style={{ color: colors.primary }}>←</BodyText>
        </Pressable>}
        <BodyText accessibilityRole={setup ? undefined : 'header'} style={[styles.topTitle, { color: colors.text }]}>
          {t(setup ? 'personal.profileSettings' : 'personal.edit')}
        </BodyText>
      </View>
      <View style={styles.intro}>
        {setup && <BodyText style={[styles.heading, { color: colors.primary }]}>{productName}.</BodyText>}
        <Pressable accessibilityRole="button" accessibilityLabel={t('personal.choosePhoto')} disabled={busy} onPress={() => void choosePhoto()} style={styles.photo}>
          {avatar}
          <BodyText style={[styles.small, { color: colors.primary }]}>{t(photo || reference ? 'personal.choosePhoto' : 'personal.addPhoto')}</BodyText>
        </Pressable>
        {(photo || reference) && <Pressable accessibilityRole="button" disabled={busy} onPress={removePhoto} style={styles.textAction}>
          <BodyText style={[styles.small, { color: colors.muted }]}>{t('personal.removePhoto')}</BodyText>
        </Pressable>}
        {setup && <>
          <BodyText accessibilityRole="header" style={styles.heading}>{t('personal.setupTitle')}</BodyText>
          <BodyText style={[styles.small, styles.center, { color: colors.muted }]}>{t('personal.setupSubtitle')}</BodyText>
        </>}
      </View>
      {error && <EmptyState message={t(error)} />}
      <View style={styles.fields}>
        <BodyText style={styles.label}>{t('personal.name')} *</BodyText>
        {nameInput}
      </View>
      <View style={styles.fields}>
        <BodyText style={styles.label}>{t('personal.gender')}</BodyText>
        {genders.map((option) => {
          const selected = gender === option;
          return <Pressable key={option ?? 'none'} accessibilityRole="radio" accessibilityState={{ checked: selected, disabled: busy }}
            disabled={busy} onPress={() => setGender(option)} style={[styles.option, {
              borderColor: selected ? colors.secondary : colors.border, backgroundColor: colors.surface,
            }]}>
            <BodyText accessible={false} style={{ color: selected ? colors.primary : colors.secondary }}>{selected ? '◉' : '○'}</BodyText>
            <BodyText style={styles.small}>{t(`gender.${option ?? 'none'}`)}</BodyText>
          </Pressable>;
        })}
      </View>
      {setup && <View style={[styles.preferenceList, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.preferenceRow}>
          <BodyText style={styles.small}>{t('settings.language')}</BodyText>
          <BodyText style={[styles.small, { color: colors.muted }]}>{t('settings.id')}</BodyText>
        </View>
        {(['theme', 'week_start'] as const).map((field) => (
          <View key={field} style={[styles.preferenceSection, { borderColor: colors.border }]}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: expanded === field, disabled: busy }}
              disabled={busy} onPress={() => setExpanded(expanded === field ? undefined : field)} style={styles.preferenceRow}>
              <BodyText style={styles.small}>{t(field === 'theme' ? 'settings.theme' : 'personal.weekStart')}</BodyText>
              <BodyText style={[styles.small, { color: colors.muted }]}>
                {t(field === 'theme' ? `settings.${preferences.theme}` : `weekdays.${preferences.week_start}`)}  {expanded === field ? '⌄' : '›'}
              </BodyText>
            </Pressable>
            {expanded === 'theme' && field === 'theme' && <PreferenceOptions field="theme" value={preferences.theme} disabled={busy}
              language={language} onChange={(theme) => { setPreferences({ ...preferences, theme }); setExpanded(undefined); }} />}
            {expanded === 'week_start' && field === 'week_start' && <PreferenceOptions field="week_start" value={preferences.week_start} disabled={busy}
              language={language} onChange={(week_start) => { setPreferences({ ...preferences, week_start }); setExpanded(undefined); }} />}
          </View>
        ))}
      </View>}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => void save()}
        style={({ pressed }) => [styles.primary, { backgroundColor: colors.primary, opacity: busy || pressed ? 0.75 : 1 }]}>
        <BodyText style={[styles.label, { color: colors.onPrimary }]}>{t(setup ? 'personal.startJourney' : 'personal.save')}{setup ? ' →' : ''}</BodyText>
      </Pressable>
      {setup
        ? <BodyText style={[styles.small, styles.center, { color: colors.muted }]}>{t('personal.localData')}</BodyText>
        : <Pressable accessibilityRole="button" disabled={busy} onPress={close} style={styles.textAction}>
          <BodyText style={[styles.small, styles.center, { color: colors.muted }]}>{t('personal.cancel')}</BodyText>
        </Pressable>}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: { minHeight: 44, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 48 },
  back: { position: 'absolute', left: 0, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  intro: { alignItems: 'center', gap: space.xs },
  photo: { alignItems: 'center', gap: space.xs, padding: space.xs },
  textAction: { minHeight: 44, justifyContent: 'center' },
  topTitle: { fontSize: typography.body, lineHeight: 22, fontWeight: '600', textAlign: 'center' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', textAlign: 'center' },
  small: { fontSize: typography.small, lineHeight: 20 },
  center: { textAlign: 'center' },
  fields: { gap: space.xs },
  label: { fontSize: typography.small, lineHeight: 20, fontWeight: '600' },
  option: { minHeight: 46, borderWidth: 1, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.sm },
  preferenceList: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.md },
  preferenceSection: { borderTopWidth: StyleSheet.hairlineWidth },
  preferenceRow: { minHeight: 52, paddingVertical: space.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  primary: { minHeight: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', padding: space.sm },
});
