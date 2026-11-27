import { StyleSheet, View } from 'react-native';
import type { PrayerId, PrayerStatus } from '../../types/prayer';

type Kind = PrayerId | PrayerStatus | 'FUTURE' | 'back' | 'next' | 'more' | 'up' | 'down' | 'heart' | 'droplet' | 'building' | 'moon' | 'settings';
type Segment = [number, number, number, number];
const segments: Partial<Record<Kind, Segment[]>> = {
  settings: [[4, 8, 9, 8], [13, 8, 20, 8], [4, 16, 13, 16], [17, 16, 20, 16]],
  COMPLETED: [[5, 12, 10, 17], [10, 17, 19, 7]], MISSED: [[6, 6, 18, 18], [18, 6, 6, 18]],
  NOT_LOGGED: [[6, 12, 18, 12]], FUTURE: [[6, 12, 18, 12]],
  EXEMPT: [[5, 12, 12, 5], [12, 5, 19, 12], [19, 12, 12, 19], [12, 19, 5, 12]],
  back: [[15, 6, 9, 12], [9, 12, 15, 18]], next: [[9, 6, 15, 12], [15, 12, 9, 18]],
  up: [[6, 15, 12, 9], [12, 9, 18, 15]], down: [[6, 9, 12, 15], [12, 15, 18, 9]],
  heart: [[12, 6, 8, 3], [8, 3, 4, 5], [4, 5, 3, 10], [3, 10, 12, 20], [12, 20, 21, 10], [21, 10, 20, 5], [20, 5, 16, 3], [16, 3, 12, 6]],
  building: [[3, 9, 12, 3], [12, 3, 21, 9], [3, 9, 21, 9], [6, 10, 6, 19], [12, 10, 12, 19], [18, 10, 18, 19], [2, 20, 22, 20]],
  droplet: [[12, 2, 6, 11], [12, 2, 18, 11], [6, 11, 5, 16], [18, 11, 19, 16], [5, 16, 8, 21], [19, 16, 16, 21], [8, 21, 16, 21]],
  fajr: [[2, 17, 22, 17], [5, 21, 19, 21], [12, 2, 12, 6], [10, 4, 12, 2], [14, 4, 12, 2]],
  maghrib: [[2, 17, 22, 17], [5, 21, 19, 21], [12, 2, 12, 6], [10, 4, 12, 6], [14, 4, 12, 6]],
  dhuhr: [[12, 1, 12, 4], [12, 20, 12, 23], [1, 12, 4, 12], [20, 12, 23, 12], [4, 4, 6, 6], [18, 18, 20, 20], [4, 20, 6, 18], [18, 6, 20, 4]],
  asr: [[2, 7, 5, 7], [8, 1, 8, 4], [15, 5, 17, 3], [7, 18, 21, 18]],
  isha: [[19, 2, 19, 8], [16, 5, 22, 5]],
};

export function PrayerIcon({ kind, color, background, size = 24 }: {
  kind: Kind; color: string; background: string; size?: number;
}) {
  const scale = size / 24;
  function circle(x: number, y: number, diameter: number, filled = false, fill = color) {
    return { position: 'absolute' as const, left: x * scale, top: y * scale, width: diameter * scale, height: diameter * scale,
      borderRadius: diameter * scale / 2, borderWidth: filled ? 0 : 1.7 * scale, borderColor: color, backgroundColor: filled ? fill : 'transparent' };
  }
  return (
    <View accessible={false} importantForAccessibility="no" style={{ width: size, height: size }}>
      {kind === 'dhuhr' && <View style={circle(6, 6, 12)} />}
      {(kind === 'fajr' || kind === 'maghrib') && <View style={[styles.horizon, { left: 6 * scale, top: 8 * scale, width: 12 * scale, height: 9 * scale }]}>
        <View style={circle(0, 1, 12)} />
      </View>}
      {kind === 'asr' && <><View style={circle(4, 5, 10)} /><View style={circle(8, 9, 12, true, background)} /><View style={circle(9, 10, 10)} /></>}
      {(kind === 'isha' || kind === 'moon') && <><View style={circle(3, 5, 16, true)} /><View style={circle(9, 3, 14, true, background)} /></>}
      {kind === 'more' && [5, 11, 17].map((x) => <View key={x} style={circle(x, 11, 2, true)} />)}
      {kind === 'settings' && <><View style={circle(9, 6, 4)} /><View style={circle(13, 14, 4)} /></>}
      {segments[kind]?.map(([x, y, endX, endY], index) => {
        const length = Math.hypot(endX - x, endY - y) * scale;
        return <View key={index} style={{ position: 'absolute', width: length, height: 1.7 * scale, borderRadius: 1,
          left: (x + endX) * scale / 2 - length / 2, top: (y + endY) * scale / 2 - scale,
          transform: [{ rotate: `${Math.atan2(endY - y, endX - x)}rad` }], backgroundColor: color }} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({ horizon: { position: 'absolute', overflow: 'hidden' } });
