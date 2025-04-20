import { Dimensions } from 'react-native';

const dimensions = Dimensions.get('window');
export const SCREEN_WIDTH = dimensions.width;
export const SCREEN_HEIGHT = dimensions.height;
export const VERTICAL_ACTIVATION_THRESHOLD = 10;
