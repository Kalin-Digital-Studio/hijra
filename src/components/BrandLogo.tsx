import { Image, StyleSheet, View } from 'react-native';
import { productName } from '../constants/application';
import { light, radius } from '../theme/tokens';

const logo = require('../../assets/branding/logo_hijra.png');

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) return (
    <View style={styles.mark}>
      <Image accessible={false} importantForAccessibility="no" source={logo} resizeMode="contain" style={styles.markArtwork} />
    </View>
  );
  return (
    <View style={styles.surface}>
      <Image accessible accessibilityLabel={productName} source={logo} resizeMode="contain" style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { width: 36, height: 44, overflow: 'hidden' },
  markArtwork: { position: 'absolute', width: 72, height: 72, left: -18, top: -5 },
  surface: { alignSelf: 'center', backgroundColor: light.background, borderRadius: radius.lg },
  logo: { width: 104, height: 104 },
});
