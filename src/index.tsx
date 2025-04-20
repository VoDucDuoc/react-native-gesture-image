import type {
  GalleryRef as GalleryRefType,
  GalleryProps as GalleryPropsType,
  ImageViewerProps as ImageViewerPropsType,
} from './Type';
import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import GalleryComponent from './Gallery';
import ImageViewerComponent from './ImageViewer';

const Gallery: ForwardRefExoticComponent<
  GalleryPropsType & RefAttributes<GalleryRefType>
> = GalleryComponent;
const ImageViewer: ComponentType<ImageViewerPropsType> = ImageViewerComponent;

export type GalleryRef = GalleryRefType;
export type GalleryProps = GalleryPropsType;
export type ImageViewerProps = ImageViewerPropsType;

export { ImageViewer };
export default Gallery;
