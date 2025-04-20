import { useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  type ImageLoadEventData,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  VERTICAL_ACTIVATION_THRESHOLD,
} from './constants';
import type { ImageViewerProps } from './Type';

const ImageViewer = ({
  source,
  imageStyle,
  enablePanDownToClose = true,
  layoutTranslateY,
  onClose,
}: ImageViewerProps) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const imageWidth = useSharedValue(0);
  const imageHeight = useSharedValue(0);
  const _MIN_SCALE = 0.8;
  const _MAX_SCALE = 2.5;
  const _MAX_SCALE_DURING_PINCH = 3;
  const _DOUBLE_TAP_SCALE = 2.5;
  const _customDuration = useMemo(() => ({ duration: 200 }), []);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [activePan, setActivePan] = useState(false);
  const [activePanDown, setActivePanDown] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const onChangeScaleValue = useCallback((isActivePan: boolean) => {
    if (isActivePan) {
      setActivePan(true);
      setActivePanDown(false);
    } else {
      setActivePan(false);
      setActivePanDown(true);
    }
  }, []);
  const onImageLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      imageWidth.value = width;
      imageHeight.value = height;
    },
    [imageWidth, imageHeight]
  );
  const onImageLoad = useCallback(
    (event: NativeSyntheticEvent<ImageLoadEventData>) => {
      const { width, height } = event.nativeEvent.source;
      setImageDimensions({
        width,
        height,
      });
    },
    []
  );
  const onLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);
  const snapToEdges = useCallback(() => {
    'worklet';
    const scaledWidth = imageWidth.value * scale.value;
    const scaledHeight = imageHeight.value * scale.value;
    runOnJS(onChangeScaleValue)(scale.value !== 1);
    if (scaledWidth > SCREEN_WIDTH) {
      const boundaryX = (scaledWidth - SCREEN_WIDTH) / scale.value / 2;
      if (Math.abs(translateX.value) > boundaryX) {
        translateX.value = withTiming(
          translateX.value > 0 ? boundaryX : -boundaryX,
          _customDuration
        );
      }
    } else {
      translateX.value = withTiming(0, { duration: 200 });
    }
    if (scaledHeight > SCREEN_HEIGHT) {
      const boundaryY = (scaledHeight - SCREEN_HEIGHT) / scale.value / 2;
      if (Math.abs(translateY.value) > boundaryY) {
        translateY.value = withTiming(
          translateY.value > 0 ? boundaryY : -boundaryY,
          _customDuration
        );
      }
    } else {
      translateY.value = withTiming(0, _customDuration);
    }
    lastTranslateX.value = translateX.value;
    lastTranslateY.value = translateY.value;
  }, [
    onChangeScaleValue,
    imageWidth,
    imageHeight,
    _customDuration,
    lastTranslateX,
    lastTranslateY,
    translateX,
    translateY,
    scale,
  ]);
  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .onStart((event) => {
          'worklet';
          focalX.value = event.focalX - SCREEN_WIDTH / 2;
          focalY.value = event.focalY - SCREEN_HEIGHT / 2;
          layoutTranslateY.value = withTiming(10, _customDuration);
        })
        .onUpdate((event) => {
          'worklet';
          const dampening = 0.1;
          const scaleFactor = 1 + (event.scale - 1) * dampening;
          const newScale = scale.value * scaleFactor;
          scale.value = clamp(newScale, _MIN_SCALE, _MAX_SCALE_DURING_PINCH);

          if (scale.value < _MAX_SCALE_DURING_PINCH) {
            const translateAdjustX = focalX.value * (1 - scaleFactor);
            const translateAdjustY = focalY.value * (1 - scaleFactor);
            translateX.value += translateAdjustX;
            translateY.value += translateAdjustY;
          }
        })
        .onEnd(() => {
          'worklet';
          if (scale.value <= 1) {
            scale.value = withTiming(1, _customDuration);
            translateX.value = withTiming(0, _customDuration);
            translateY.value = withTiming(0, _customDuration);
            lastTranslateX.value = 0;
            lastTranslateY.value = 0;
            layoutTranslateY.value = withTiming(0, _customDuration);
          } else if (scale.value > _MAX_SCALE) {
            scale.value = withTiming(_MAX_SCALE, _customDuration);
          }
          snapToEdges();
        }),
    [
      snapToEdges,
      _customDuration,
      focalX,
      focalY,
      lastTranslateX,
      lastTranslateY,
      layoutTranslateY,
      scale,
      translateX,
      translateY,
    ]
  );
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          'worklet';
          lastTranslateX.value = translateX.value;
          lastTranslateY.value = translateY.value;
        })
        .onUpdate((event) => {
          'worklet';
          if (scale.value > 1) {
            const scaledWidth = imageWidth.value * scale.value;
            const scaledHeight = imageHeight.value * scale.value;
            const canTranslateX = scaledWidth > SCREEN_WIDTH;
            const canTranslateY = scaledHeight > SCREEN_HEIGHT;
            const translationSpeed = 1 / Math.max(1, scale.value / 2);
            const adjustedTranslationX = event.translationX * translationSpeed;
            const adjustedTranslationY = event.translationY * translationSpeed;
            if (canTranslateX) {
              const boundaryX = (scaledWidth - SCREEN_WIDTH) / scale.value / 2;
              const maxTranslateX = boundaryX + 30;
              const minTranslateX = -maxTranslateX;
              const newTranslateX = lastTranslateX.value + adjustedTranslationX;
              translateX.value = clamp(
                newTranslateX,
                minTranslateX,
                maxTranslateX
              );
            }
            if (canTranslateY) {
              const boundaryY =
                (scaledHeight - SCREEN_HEIGHT) / scale.value / 2;
              const maxTranslateY = boundaryY + 30;
              const minTranslateY = -maxTranslateY;
              const newTranslateY = lastTranslateY.value + adjustedTranslationY;
              translateY.value = clamp(
                newTranslateY,
                minTranslateY,
                maxTranslateY
              );
            }
          }
        })
        .onEnd(() => {
          'worklet';
          snapToEdges();
        })
        .enabled(activePan),
    [
      activePan,
      snapToEdges,
      imageWidth,
      imageHeight,
      lastTranslateX,
      lastTranslateY,
      scale,
      translateX,
      translateY,
    ]
  );
  const panDown = useMemo(
    () =>
      Gesture.Pan()
        .enabled(activePanDown && enablePanDownToClose)
        .activeOffsetY([
          -VERTICAL_ACTIVATION_THRESHOLD,
          VERTICAL_ACTIVATION_THRESHOLD,
        ])
        .onStart(() => {
          'worklet';
          translateY.value = 0;
          translateX.value = 0;
          layoutTranslateY.value = withTiming(10, _customDuration);
        })
        .onUpdate((event) => {
          'worklet';
          translateY.value = event.translationY;
          if (event.translationY !== 0) {
            translateX.value = event.translationX;
          }
        })
        .onEnd((event) => {
          'worklet';
          const isFastFlick = event.velocityY > 500 && event.translationY > 0;

          if (isFastFlick && onClose) {
            runOnJS(onClose)();
          }
          translateY.value = withTiming(0, _customDuration);
          translateX.value = withTiming(0, _customDuration);
          layoutTranslateY.value = withTiming(0, _customDuration);
        }),
    [
      activePanDown,
      enablePanDownToClose,
      onClose,
      _customDuration,
      translateX,
      translateY,
      layoutTranslateY,
    ]
  );
  const doubleTap = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onStart((event) => {
          'worklet';
          if (scale.value > 1) {
            scale.value = withTiming(1, _customDuration);
            translateX.value = withTiming(0, _customDuration);
            translateY.value = withTiming(0, _customDuration);
            layoutTranslateY.value = withTiming(0, _customDuration);
            lastTranslateX.value = 0;
            lastTranslateY.value = 0;
            runOnJS(onChangeScaleValue)(false);
          } else {
            const tapX = event.x - SCREEN_WIDTH / 2;
            const tapY = event.y - SCREEN_HEIGHT / 2;
            const newScale = _DOUBLE_TAP_SCALE;
            const scaledWidth = imageWidth.value * newScale;
            const scaledHeight = imageHeight.value * newScale;
            let newTranslateX = 0;
            let newTranslateY = 0;
            if (scaledWidth > SCREEN_WIDTH) {
              const boundaryX = (scaledWidth - SCREEN_WIDTH) / newScale / 2;
              newTranslateX = -tapX * (newScale - 1);
              newTranslateX = clamp(newTranslateX, -boundaryX, boundaryX);
              translateX.value = withTiming(newTranslateX, _customDuration);
            }
            if (scaledHeight > SCREEN_HEIGHT) {
              const boundaryY = (scaledHeight - SCREEN_HEIGHT) / newScale / 2;
              newTranslateY = -tapY * (newScale - 1);
              newTranslateY = clamp(newTranslateY, -boundaryY, boundaryY);
              translateY.value = withTiming(newTranslateY, _customDuration);
            }
            scale.value = withTiming(newScale, _customDuration);
            layoutTranslateY.value = withTiming(10, _customDuration);
            lastTranslateY.value = newTranslateY;
            lastTranslateX.value = newTranslateX;
            runOnJS(onChangeScaleValue)(true);
          }
        }),
    [
      onChangeScaleValue,
      imageWidth,
      imageHeight,
      _customDuration,
      lastTranslateX,
      lastTranslateY,
      layoutTranslateY,
      scale,
      translateX,
      translateY,
    ]
  );
  const gesture = useMemo(
    () => Gesture.Simultaneous(Gesture.Race(pinch, pan, doubleTap), panDown),
    [pinch, pan, doubleTap, panDown]
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));
  const imageAnimatedStyle = useMemo(
    () => [
      animatedStyle,
      {
        width: SCREEN_WIDTH,
        height: (SCREEN_WIDTH * imageDimensions.height) / imageDimensions.width,
      },
      imageStyle,
    ],
    [animatedStyle, imageDimensions, imageStyle]
  );
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container]}>
        <Animated.Image
          source={source}
          style={imageAnimatedStyle}
          resizeMode="contain"
          onLayout={onImageLayout}
          onLoad={onImageLoad}
          onLoadEnd={onLoadEnd}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});
export default ImageViewer;
