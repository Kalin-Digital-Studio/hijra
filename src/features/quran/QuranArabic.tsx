import { StyleSheet } from 'react-native';
import { BodyText } from '../../components/ui';

export const quranArabicFamily = 'HijraAmiriQuran';

export function QuranArabic({ text, size, centered, system, color }: {
  text: string; size: number; centered?: boolean; system?: boolean; color?: string;
}) {
  return <BodyText accessibilityLanguage="ar" style={[
    styles.arabic,
    { fontSize: size, lineHeight: Math.ceil(size * 2) },
    !system && styles.amiri,
    centered && styles.center,
    color && { color },
  ]}>{text}</BodyText>;
}

const styles = StyleSheet.create({
  arabic: { textAlign: 'right', writingDirection: 'rtl', includeFontPadding: true },
  amiri: { fontFamily: quranArabicFamily },
  center: { textAlign: 'center' },
});
