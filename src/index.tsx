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
import GalleryImpl from './Gallery';
import ImageViewerImpl from './ImageViewer';

const GalleryComponent: ForwardRefExoticComponent<
  GalleryPropsType & RefAttributes<GalleryRefType>
> = GalleryImpl;
const ImageViewerComponent: ComponentType<ImageViewerPropsType> =
  ImageViewerImpl;

export type GalleryRef = GalleryRefType;
export type GalleryProps = GalleryPropsType;
export type ImageViewerProps = ImageViewerPropsType;

export { ImageViewerComponent as ImageViewer };
export default GalleryComponent;
