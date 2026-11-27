import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { dark, light } from '../../theme/tokens';
import { angle } from '../../services/islamic/rules';

const tickMarks = Array.from({ length: 36 }, (_, index) => index);
const cardinals = ['northLetter', 'eastLetter', 'southLetter', 'westLetter'] as const;

function point(degrees: number, radius: number, center: number) {
  const radians = degrees * Math.PI / 180;
  return { left: center + Math.sin(radians) * radius, top: center - Math.cos(radians) * radius };
}

export function QiblaDial({ bearing, heading }: { bearing: number | null; heading?: number }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const size = Math.min(208, Math.max(120, width - 88));
  const face = size - 28;
  const center = face / 2;
  const rotation = bearing === null ? 0 : angle(bearing - (heading ?? 0));
  const marker = point(rotation, center + 3, center);
  const needleLength = center - 19;

  return <View accessible accessibilityLabel={bearing === null ? t('hub.qibla') :
    t(heading === undefined ? 'hub.staticBearing' : 'hub.compass', { bearing: bearing.toFixed(1) })}
    style={[styles.rim, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surface, borderColor: colors.border }]}>
    <View style={[styles.face, { width: face, height: face, borderRadius: center }]}>
      {tickMarks.map((index) => {
        const degrees = index * 10 - (heading ?? 0);
        const length = index % 3 === 0 ? 7 : 4;
        const position = point(degrees, center - 14, center);
        return <View key={index} style={[styles.tick, {
          left: position.left - 0.5, top: position.top - length / 2,
          height: length, transform: [{ rotate: `${degrees}deg` }],
        }]} />;
      })}
      {cardinals.map((label, index) => {
        const position = point(index * 90 - (heading ?? 0), center - 27, center);
        return <BodyText key={label} allowFontScaling={false} style={[styles.cardinal, {
          left: position.left - 10, top: position.top - 8,
        }]}>{t(`hub.${label}`)}</BodyText>;
      })}
      {bearing !== null && <>
        <View style={[styles.needle, { transform: [{ rotate: `${rotation}deg` }] }]}>
          <View style={[styles.tip, { borderBottomWidth: needleLength, borderBottomColor: colors.accent }]} />
          <View style={[styles.tip, { bottom: undefined, top: '50%', borderTopWidth: needleLength * 0.78, borderTopColor: light.secondary }]} />
        </View>
        <View style={[styles.pin, { left: center - 6, top: center - 6, borderColor: colors.accent }]} />
        <View style={[styles.kaaba, { left: marker.left - 12, top: marker.top - 12 }]}>
          <View style={[styles.kaabaSide, styles.kaabaLeft]}><View style={styles.kaabaBand} /></View>
          <View style={[styles.kaabaSide, styles.kaabaRight]}><View style={styles.kaabaBand} /></View>
          <View style={styles.kaabaTop} />
        </View>
      </>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  rim: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  face: { backgroundColor: light.primary, alignItems: 'center', justifyContent: 'center' },
  tick: { position: 'absolute', width: 1, backgroundColor: light.secondary },
  cardinal: { position: 'absolute', width: 20, textAlign: 'center', fontSize: 11, lineHeight: 16, color: light.onPrimary },
  needle: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center' },
  tip: { position: 'absolute', borderLeftWidth: 10, borderRightWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', bottom: '50%' },
  pin: { position: 'absolute', width: 12, height: 12, borderRadius: 6, borderWidth: 2, backgroundColor: light.surface },
  kaaba: { position: 'absolute', width: 24, height: 24 },
  kaabaSide: { position: 'absolute', top: 7, width: 12, height: 14, overflow: 'hidden' },
  kaabaLeft: { left: 0, backgroundColor: light.text, transform: [{ skewY: '25deg' }] },
  kaabaRight: { right: 0, backgroundColor: dark.background, transform: [{ skewY: '-25deg' }] },
  kaabaBand: { height: 4, backgroundColor: light.accent, marginTop: 4 },
  kaabaTop: { position: 'absolute', top: 0, left: 5, width: 14, height: 14, backgroundColor: light.text, transform: [{ rotate: '45deg' }, { scaleY: 0.62 }] },
});
