import {
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { type ImageSourcePropType, StyleSheet, FlatList } from 'react-native';
import ImageViewer from './ImageViewer';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  VERTICAL_ACTIVATION_THRESHOLD,
} from './constants';
import type { GalleryProps, GalleryRef } from './types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Gallery = forwardRef<GalleryRef, GalleryProps>(
  (
    {
      data = [],
      style,
      imageStyle,
      containerStyle,
      contentContainerStyle,
      backdropColor = 'black',
      initialIndex = 0,
      enablePanDownToClose,
      renderHeader,
      renderFooter,
      ...props
    },
    ref
  ) => {
    const flatListRef = useRef<FlatList>(null);
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const layoutTranslateY = useSharedValue(0);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      if (flatListRef.current && initialIndex >= 0) {
        flatListRef.current.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }
    }, [initialIndex]);
    useImperativeHandle(ref, () => ({
      show,
      hide,
      isVisible,
    }));
    const show = useCallback(
      (index: number = 0) => {
        translateY.value = withTiming(0, { duration: 200 });
        setIsVisible(true);
        if (flatListRef.current && index >= 0) {
          flatListRef.current.scrollToIndex({
            index,
            animated: false,
          });
        }
      },
      [translateY, flatListRef]
    );
    const hide = useCallback(() => {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
      setIsVisible(false);
    }, [translateY]);
    const renderItem = useCallback(
      ({ item }: { item: ImageSourcePropType }) => (
        <ImageViewer
          source={item}
          imageStyle={imageStyle}
          enablePanDownToClose={enablePanDownToClose}
          onClose={hide}
          layoutTranslateY={layoutTranslateY}
        />
      ),
      [imageStyle, enablePanDownToClose, layoutTranslateY, hide]
    );
    const transformAnimated = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));
    const backdropAnimated = useAnimatedStyle(() => ({
      backgroundColor: backdropColor,
      opacity: interpolate(
        layoutTranslateY.value,
        [-VERTICAL_ACTIVATION_THRESHOLD, 0, VERTICAL_ACTIVATION_THRESHOLD],
        [0.9, 1, 0.9],
        'clamp'
      ),
    }));
    const hideLayoutAnimated = useAnimatedStyle(() => ({
      opacity: interpolate(
        layoutTranslateY.value,
        [-VERTICAL_ACTIVATION_THRESHOLD, 0, VERTICAL_ACTIVATION_THRESHOLD],
        [0, 1, 0]
      ),
    }));
    const translateHeaderAnimated = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(
            layoutTranslateY.value,
            [
              -VERTICAL_ACTIVATION_THRESHOLD * 2,
              0,
              VERTICAL_ACTIVATION_THRESHOLD * 2,
            ],
            [-50, 0, -50],
            'clamp'
          ),
        },
      ],
    }));
    const translateFooterAnimated = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(
            layoutTranslateY.value,
            [
              -VERTICAL_ACTIVATION_THRESHOLD * 2,
              0,
              VERTICAL_ACTIVATION_THRESHOLD * 2,
            ],
            [50, 0, 50],
            'clamp'
          ),
        },
      ],
    }));
    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
      }),
      []
    );
    return (
      <GestureHandlerRootView style={styles.gestureContainer}>
        <Animated.View
          style={[styles.container, containerStyle, transformAnimated]}
        >
          <Animated.View
            style={[StyleSheet.absoluteFillObject, backdropAnimated]}
          />
          <Animated.FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(_, index) => `ImageViewer-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={true}
            getItemLayout={getItemLayout}
            style={[styles.container, style]}
            contentContainerStyle={contentContainerStyle}
            initialScrollIndex={initialIndex}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={2}
            removeClippedSubviews={true}
            onScrollToIndexFailed={(info) => {
              console.warn('Scroll to index failed:', info);
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: initialIndex,
                  animated: false,
                });
              }, 100);
            }}
            {...props}
            renderItem={renderItem}
            CellRendererComponent={undefined}
          />
          {renderHeader && (
            <Animated.View
              style={[
                styles.headerContainer,
                hideLayoutAnimated,
                translateHeaderAnimated,
              ]}
            >
              {renderHeader()}
            </Animated.View>
          )}
        </Animated.View>
        {renderFooter && (
          <Animated.View
            style={[
              styles.footerContainer,
              hideLayoutAnimated,
              translateFooterAnimated,
            ]}
          >
            {renderFooter()}
          </Animated.View>
        )}
      </GestureHandlerRootView>
    );
  }
);
const styles = StyleSheet.create({
  gestureContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default Gallery;
