import type {
  ImageStyle,
  ImageSourcePropType,
  ViewStyle,
  FlatList,
  FlatListProps,
} from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface ImageViewerProps {
  source: ImageSourcePropType;
  imageStyle?: ImageStyle;
  enablePanDownToClose?: boolean;
  layoutTranslateY: SharedValue<number>;
  onClose?: () => void;
}
export interface GalleryProps
  extends Omit<FlatListProps<ImageSourcePropType>, 'data'> {
  data: ImageSourcePropType[];
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backdropColor?: string;
  initialIndex?: number;
  enablePanDownToClose?: boolean;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}
export interface GalleryRef {
  show: (index?: number) => void;
  hide: () => void;
  isVisible: boolean;
}
export interface GalleryControl {
  show: (index?: number) => void;
  hide: () => void;
  isVisible: SharedValue<boolean>;
  translateY: SharedValue<number>;
  flatListRef: React.RefObject<FlatList>;
}
