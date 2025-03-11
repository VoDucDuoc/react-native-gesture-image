import type { ImageStyle, ImageSourcePropType, ViewStyle } from 'react-native';

export interface ImageViewerProps {
  source: ImageSourcePropType;
  imageStyle?: ImageStyle;
}

export interface GalleryProps {
  data: ImageSourcePropType[];
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backdropColor?: string;
}
