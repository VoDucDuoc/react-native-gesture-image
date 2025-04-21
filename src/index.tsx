import type { GalleryRef, GalleryProps, ImageViewerProps } from './types';
import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import GalleryComponent from './Gallery';
import ImageViewerComponent from './ImageViewer';

const Gallery: ForwardRefExoticComponent<
  GalleryProps & RefAttributes<GalleryRef>
> = GalleryComponent;
const ImageViewer: ComponentType<ImageViewerProps> = ImageViewerComponent;

export type { GalleryRef, GalleryProps };
export { ImageViewer };
export default Gallery;
