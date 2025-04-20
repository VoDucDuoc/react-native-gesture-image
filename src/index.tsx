import type { GalleryRef, GalleryProps, ImageViewerProps } from './Type';
import type { ComponentType } from 'react';

export type { GalleryRef, GalleryProps, ImageViewerProps };

import GalleryImpl from './Gallery';
import ImageViewerImpl from './ImageViewer';

const GalleryComponent: ComponentType<GalleryProps> = GalleryImpl;
const ImageViewerComponent: ComponentType<ImageViewerProps> = ImageViewerImpl;

export { ImageViewerComponent as ImageViewer };
export default GalleryComponent;
