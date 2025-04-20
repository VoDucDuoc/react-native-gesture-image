import type {
  ImageStyle,
  ImageSourcePropType,
  ViewStyle,
  FlatList,
  FlatListProps,
} from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Props for the ImageViewer component
 */
export interface ImageViewerProps {
  /** The image source to display */
  source: ImageSourcePropType;
  /** Optional styles to apply to the image */
  imageStyle?: ImageStyle;
  /** Whether to enable pan down to close gesture */
  enablePanDownToClose?: boolean;
  /** Shared value for layout translation on Y axis */
  layoutTranslateY: SharedValue<number>;
  /** Callback function when the viewer is closed */
  onClose?: () => void;
}

/**
 * Props for the Gallery component
 */
export interface GalleryProps
  extends Omit<FlatListProps<ImageSourcePropType>, 'data' | 'renderItem'> {
  /** Array of image sources to display in the gallery */
  data: ImageSourcePropType[];
  /** Optional styles to apply to the gallery container */
  style?: ViewStyle;
  /** Optional styles to apply to each image */
  imageStyle?: ImageStyle;
  /** Optional styles to apply to the gallery container */
  containerStyle?: ViewStyle;
  /** Optional styles to apply to the content container */
  contentContainerStyle?: ViewStyle;
  /** Color of the backdrop (default: 'black') */
  backdropColor?: string;
  /** Initial index to display (default: 0) */
  initialIndex?: number;
  /** Whether to enable pan down to close gesture */
  enablePanDownToClose?: boolean;
  /** Function to render header content */
  renderHeader?: () => React.ReactNode;
  /** Function to render footer content */
  renderFooter?: () => React.ReactNode;
}

/**
 * Reference methods for the Gallery component
 */
export interface GalleryRef {
  /** Show the gallery at the specified index */
  show: (index?: number) => void;
  /** Hide the gallery */
  hide: () => void;
  /** Whether the gallery is currently visible */
  isVisible: boolean;
}

/**
 * Internal control interface for the Gallery component
 */
export interface GalleryControl {
  /** Show the gallery at the specified index */
  show: (index?: number) => void;
  /** Hide the gallery */
  hide: () => void;
  /** Shared value indicating whether the gallery is visible */
  isVisible: SharedValue<boolean>;
  /** Shared value for translation on Y axis */
  translateY: SharedValue<number>;
  /** Reference to the FlatList component */
  flatListRef: React.RefObject<FlatList>;
}
