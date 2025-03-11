import { useState } from 'react';
import {
  type ImageLoadEventData,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';
import type { ImageViewerProps } from './Type';

const MIN_SCALE = 0.8;
const MAX_SCALE = 2.5;
const MAX_SCALE_DURING_PINCH = 3;
const DOUBLE_TAP_SCALE = 2.5;

const ImageViewer = ({ source, imageStyle }: ImageViewerProps) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const imageWidth = useSharedValue(0);
  const imageHeight = useSharedValue(0);

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [activePan, setActivePan] = useState(false);

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    imageWidth.value = width;
    imageHeight.value = height;
  };

  const onImageLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { width, height } = event.nativeEvent.source;
    setImageDimensions({
      width,
      height,
    });
  };

  const snapToEdges = () => {
    'worklet';
    const scaledWidth = imageWidth.value * scale.value;
    const scaledHeight = imageHeight.value * scale.value;

    runOnJS(setActivePan)(scale.value !== 1);

    if (scaledWidth > SCREEN_WIDTH) {
      const boundaryX = (scaledWidth - SCREEN_WIDTH) / scale.value / 2;
      if (Math.abs(translateX.value) > boundaryX) {
        translateX.value = withTiming(
          translateX.value > 0 ? boundaryX : -boundaryX
        );
      }
    } else {
      translateX.value = withTiming(0);
    }

    if (scaledHeight > SCREEN_HEIGHT) {
      const boundaryY = (scaledHeight - SCREEN_HEIGHT) / scale.value / 2;

      if (Math.abs(translateY.value) > boundaryY) {
        translateY.value = withTiming(
          translateY.value > 0 ? boundaryY : -boundaryY
        );
      }
    } else {
      translateY.value = withTiming(0);
    }

    lastTranslateX.value = translateX.value;
    lastTranslateY.value = translateY.value;
  };

  const pinch = Gesture.Pinch()
    .onStart((event) => {
      focalX.value = event.focalX - SCREEN_WIDTH / 2;
      focalY.value = event.focalY - SCREEN_HEIGHT / 2;
    })
    .onUpdate((event) => {
      const dampening = 0.1;
      const scaleFactor = 1 + (event.scale - 1) * dampening;
      const newScale = scale.value * scaleFactor;
      scale.value = clamp(newScale, MIN_SCALE, MAX_SCALE_DURING_PINCH);

      if (scale.value < MAX_SCALE_DURING_PINCH) {
        const translateAdjustX = focalX.value * (1 - scaleFactor);
        const translateAdjustY = focalY.value * (1 - scaleFactor);
        translateX.value += translateAdjustX;
        translateY.value += translateAdjustY;
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        scale.value = withTiming(1, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
      } else if (scale.value > MAX_SCALE) {
        scale.value = withTiming(MAX_SCALE, { duration: 300 });
      }
      snapToEdges();
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
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
          translateX.value = clamp(newTranslateX, minTranslateX, maxTranslateX);
        }

        if (canTranslateY) {
          const boundaryY = (scaledHeight - SCREEN_HEIGHT) / scale.value / 2;
          const maxTranslateY = boundaryY + 30;
          const minTranslateY = -maxTranslateY;

          const newTranslateY = lastTranslateY.value + adjustedTranslationY;
          translateY.value = clamp(newTranslateY, minTranslateY, maxTranslateY);
        }
      }
    })
    .onEnd(() => {
      snapToEdges();
    })
    .enabled(activePan);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart((event) => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
        runOnJS(setActivePan)(false);
      } else {
        const tapX = event.x - SCREEN_WIDTH / 2;
        const tapY = event.y - SCREEN_HEIGHT / 2;

        const newScale = DOUBLE_TAP_SCALE;

        const scaledWidth = imageWidth.value * newScale;
        const scaledHeight = imageHeight.value * newScale;
        let newTranslateX = 0;
        let newTranslateY = 0;
        if (scaledWidth > SCREEN_WIDTH) {
          const boundaryX = (scaledWidth - SCREEN_WIDTH) / newScale / 2;
          newTranslateX = -tapX * (newScale - 1);
          newTranslateX = clamp(newTranslateX, -boundaryX, boundaryX);
          translateX.value = withTiming(newTranslateX);
        }

        if (scaledHeight > SCREEN_HEIGHT) {
          const boundaryY = (scaledHeight - SCREEN_HEIGHT) / newScale / 2;
          newTranslateY = -tapY * (newScale - 1);
          newTranslateY = clamp(newTranslateY, -boundaryY, boundaryY);
          translateY.value = withTiming(newTranslateY);
        }

        scale.value = withTiming(newScale);
        lastTranslateY.value = newTranslateY;
        lastTranslateX.value = newTranslateX;
        runOnJS(setActivePan)(true);
      }
    });

  // Update gesture to include singleTap
  const gesture = Gesture.Race(Gesture.Simultaneous(pinch, pan), doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container]}>
        <Animated.Image
          source={source}
          style={[
            animatedStyle,
            {
              width: SCREEN_WIDTH,
              height:
                (SCREEN_WIDTH * imageDimensions.height) / imageDimensions.width,
            },
            imageStyle,
          ]}
          resizeMode="contain"
          onLayout={onImageLayout}
          onLoad={onImageLoad}
        />
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
});

export default ImageViewer;
