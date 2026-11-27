import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import type { DhikrDisplayPreferences } from '../../database/repositories/dhikr';
import { useTheme } from '../../hooks/useTheme';
import { getDhikrReadingHelp } from '../../services/dhikrReadingHelp';
import { getDhikrReviewContent } from '../../services/dhikrReviewContent';
import type { DhikrStep } from '../../services/dhikrRules';
import { radius, space } from '../../theme/tokens';

export function DhikrReadingHelp({ step, personal, display }: {
  step: DhikrStep; personal: boolean; display: DhikrDisplayPreferences | undefined;
}) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  if (step.id === 'free') return null;
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { latin, meaning, english } = getDhikrReadingHelp(step, personal, language);
  const draft = __DEV__ && !personal ? getDhikrReviewContent(step) : null;
  const latinText = latin ?? draft?.latin;
  const draftMeaning = language === 'en' ? draft?.english ?? draft?.meaning : draft?.meaning;
  const needsReview = (display?.latin && !latin && !!draft?.latin)
    || (display?.translation && !english && !meaning && !!draftMeaning);

  return <>
    {personal && <BodyText style={[styles.label, { color: colors.muted }]}>{t('dhikr.personalReading')}</BodyText>}
    {needsReview && <BodyText style={[styles.label, { color: colors.muted }]}>{t('dhikr.contentInReview')}</BodyText>}
    {display?.latin && <View style={styles.section}>
      <BodyText style={[styles.label, { color: colors.muted }]}>{t('dhikr.latinTitle')}</BodyText>
      <BodyText style={latinText ? styles.latin : { color: colors.muted }}>{latinText ?? t('dhikr.latinUnavailable')}</BodyText>
    </View>}
    {display?.translation && <View style={[styles.meaning, { backgroundColor: colors.selected }]}>
      <BodyText style={[styles.label, { color: colors.primary }]}>{t('dhikr.meaningTitle')}</BodyText>
      {english ? <>
        <BodyText>{english.basmalah}</BodyText>
        {english.lines.map((line, index) => <BodyText key={index}>{index + 1}. {line}</BodyText>)}
        <BodyText style={[styles.label, { color: colors.muted }]}>{english.source}</BodyText>
      </> : <>
        {!meaning && draftMeaning && language === 'en' && !draft?.english &&
          <BodyText style={styles.label}>{t('dhikr.indonesianLanguage')}</BodyText>}
        <BodyText>{meaning ?? draftMeaning ?? t('dhikr.translationUnavailable')}</BodyText>
      </>}
    </View>}
  </>;
}

const styles = StyleSheet.create({
  section: { gap: space.xs },
  label: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
  latin: { fontStyle: 'italic', textAlign: 'left', writingDirection: 'ltr' },
  meaning: { borderRadius: radius.md, padding: space.sm, gap: space.xs },
});
