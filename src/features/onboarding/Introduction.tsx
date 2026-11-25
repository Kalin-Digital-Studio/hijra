import { useRef, useState, type ComponentRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppHeader, BodyText, Button } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { radius, space } from '../../theme/tokens';

const illustrations = [
  require('../../../assets/onboarding/introduction.png'),
  require('../../../assets/onboarding/daily-worship.png'),
  require('../../../assets/onboarding/personal-growth.png'),
];
const previewImages = __DEV__ ? [
  require('../../../assets/onboarding/preview/image_1.png'),
  require('../../../assets/onboarding/preview/image_2.png'),
  require('../../../assets/onboarding/preview/image_3.png'),
] : undefined;
type IntroductionMode = 'FIRST_RUN' | 'REPLAY';

function OnboardingSlide({ index, width, height, active, onPrevious, onNext, onSkip, nextLabel, language }: {
  index: number; width: number; height: number; active: boolean; onPrevious?: () => void;
  onNext: () => void; onSkip: () => void; nextLabel: string; language?: 'id';
}) {
  const { t } = useTranslation(undefined, { lng: language });
  if (previewImages) {
    const source = previewImages[index];
    const dimensions = Image.resolveAssetSource(source);
    const aspectRatio = dimensions?.width && dimensions.height ? dimensions.width / dimensions.height : 9 / 16;
    const imageWidth = Math.min(width, height * aspectRatio);
    const imageHeight = imageWidth / aspectRatio;
    const finalSlide = index === previewImages.length - 1;
    return (
      <View style={[styles.previewPage, { width, height }]} accessibilityElementsHidden={!active} importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}>
        <View style={[styles.previewArtwork, { width: imageWidth, height: imageHeight }]}>
          <Image accessibilityLabel={`${t(`intro.slides.${index}.title`)}. ${t('intro.page', { current: index + 1, total: previewImages.length })}`} source={source} resizeMode="contain"
            style={{ width: imageWidth, height: imageHeight }} />
          {onPrevious && <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={onPrevious} style={[styles.previewArrow, styles.leftArrow]}>
            <BodyText style={styles.arrowText}>‹</BodyText>
          </Pressable>}
          {!finalSlide && <Pressable accessibilityRole="button" accessibilityLabel={nextLabel} onPress={onNext} style={[styles.previewArrow, styles.rightArrow]}>
            <BodyText style={styles.arrowText}>›</BodyText>
          </Pressable>}
          {finalSlide && <Pressable accessibilityRole="button" accessibilityLabel={nextLabel} onPress={onNext}
            style={({ pressed }) => [styles.previewFinish, pressed && styles.previewFinishPressed]}>
            <BodyText numberOfLines={1} adjustsFontSizeToFit style={styles.previewFinishText}>{nextLabel}  →</BodyText>
          </Pressable>}
          <Pressable accessibilityRole="button" onPress={onSkip} style={styles.previewSkip}>
            <BodyText style={styles.skipOnImage}>{t('intro.skip')}</BodyText>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.slide, { width }]} accessibilityElementsHidden={!active} importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}>
      <Image accessible={false} source={illustrations[index]} resizeMode="contain" style={styles.illustration} />
      <AppHeader title={t(`intro.slides.${index}.title`)} />
      <BodyText>{t(`intro.slides.${index}.description`)}</BodyText>
    </View>
  );
}

export function Introduction({ mode, onDone }: { mode: IntroductionMode; onDone: () => void }) {
  const language = mode === 'FIRST_RUN' ? 'id' : undefined;
  const { t } = useTranslation(undefined, { lng: language });
  const { colors } = useTheme();
  const window = useWindowDimensions();
  const [width, setWidth] = useState(window.width);
  const [height, setHeight] = useState(window.height);
  const [active, setActive] = useState(0);
  const pager = useRef<ComponentRef<typeof ScrollView>>(null);
  const last = active === illustrations.length - 1;
  const finishLabel = t(mode === 'FIRST_RUN' ? 'intro.start' : 'intro.finish');

  function go(index: number) {
    if (index < 0 || index >= illustrations.length) return;
    pager.current?.scrollTo({ x: width * index, animated: false });
    setActive(index);
  }

  const slides = (
    <View style={previewImages ? styles.screen : undefined} onLayout={(event) => {
      const { width: next, height: viewportHeight } = event.nativeEvent.layout;
      if (previewImages && viewportHeight > 0) setHeight(viewportHeight);
      if (!next || next === width) return;
      setWidth(next);
      requestAnimationFrame(() => pager.current?.scrollTo({ x: next * active, animated: false }));
    }}>
      <ScrollView ref={pager} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => setActive(Math.max(0, Math.min(illustrations.length - 1,
          Math.round(event.nativeEvent.contentOffset.x / width))))}>
        {illustrations.map((_, index) => <OnboardingSlide key={index} width={width} height={height} index={index} active={index === active} language={language}
          onPrevious={index > 0 ? () => go(index - 1) : undefined}
          onNext={index === illustrations.length - 1 ? onDone : () => go(index + 1)}
          onSkip={onDone} nextLabel={index === illustrations.length - 1 ? finishLabel : t('intro.next')} />)}
      </ScrollView>
    </View>
  );

  if (previewImages) return (
    <SafeAreaView style={[styles.screen, styles.previewBackground]}>
      <StatusBar style="dark" />
      {slides}
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {slides}
        <View style={styles.controls}>
          <View accessible accessibilityLabel={t('intro.page', { current: active + 1, total: illustrations.length })} style={styles.dots}>
            {illustrations.map((_, index) => <View key={index} style={[styles.dot, { backgroundColor: index === active ? colors.primary : colors.border }]} />)}
          </View>
          <View style={styles.actions}>
            <Button label={t('back')} onPress={() => go(active - 1)} disabled={active === 0} />
            <Button label={t(last ? mode === 'FIRST_RUN' ? 'intro.start' : 'intro.finish' : 'intro.next')} onPress={() => last ? onDone() : go(active + 1)} />
            <Pressable accessibilityRole="button" onPress={onDone} style={styles.textAction}><BodyText>{t('intro.skip')}</BodyText></Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: space.lg, gap: space.md, width: '100%', maxWidth: 680, alignSelf: 'center' },
  controls: { paddingHorizontal: space.lg, gap: space.sm },
  slide: { paddingHorizontal: space.lg, gap: space.sm },
  illustration: { height: 200, width: '100%', borderRadius: radius.lg },
  previewBackground: { backgroundColor: '#F6E9DA' },
  previewPage: { alignItems: 'center', justifyContent: 'center' },
  previewArtwork: { overflow: 'hidden' },
  previewFinish: { position: 'absolute', left: '18%', right: '18%', top: '85%', height: '7.5%', borderRadius: 32, borderWidth: 2, borderColor: '#C7A76C', backgroundColor: '#174638', alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.sm },
  previewFinishPressed: { backgroundColor: '#265E4C' },
  previewFinishText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18, lineHeight: 24 },
  previewArrow: { position: 'absolute', top: '50%', transform: [{ translateY: -22 }], width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(23,70,56,0.9)', alignItems: 'center', justifyContent: 'center' },
  leftArrow: { left: space.xs },
  rightArrow: { right: space.xs },
  arrowText: { color: '#FFFFFF', fontSize: 32, lineHeight: 36, textAlign: 'center' },
  previewSkip: { position: 'absolute', bottom: 0, alignSelf: 'center', paddingHorizontal: space.lg, minHeight: 32, justifyContent: 'center' },
  skipOnImage: { color: '#174638', fontWeight: '700', fontSize: 14, lineHeight: 20 },
  textAction: { alignSelf: 'center', minHeight: 44, paddingHorizontal: space.sm, justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: space.xs, justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, justifyContent: 'center' },
});
