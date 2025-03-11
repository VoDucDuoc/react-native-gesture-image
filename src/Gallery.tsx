import React, { useCallback } from 'react';
import {
  FlatList,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import ImageViewer from './ImageViewer';
import Animated from 'react-native-reanimated';
import { SCREEN_WIDTH } from './constants';
import type { GalleryProps } from './Type';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function Gallery({
  data = [],
  style,
  imageStyle,
  containerStyle,
  contentContainerStyle,
  backdropColor = 'black',
}: GalleryProps) {
  const flatListRef = React.useRef<FlatList>(null);

  const renderItem = useCallback(
    ({ item, index }: { item: ImageSourcePropType; index: number }) => (
      <ImageViewer key={index} source={item} imageStyle={imageStyle} />
    ),
    [imageStyle]
  );

  return (
    <GestureHandlerRootView>
      <View style={[styles.container, containerStyle]}>
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          style={[styles.container, { backgroundColor: backdropColor }, style]}
          contentContainerStyle={contentContainerStyle}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Gallery;
