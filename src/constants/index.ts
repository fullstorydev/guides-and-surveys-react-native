import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
export const pixelDensity = PixelRatio.get();

const adjustedWidth = width / pixelDensity;
const adjustedHeight = height / pixelDensity;

export const diagonalScale =
  Math.sqrt(adjustedWidth ** 2 + adjustedHeight ** 2) * 0.001;

export const THEME_DEFAULT = {
  primaryColor: '#387DFF',
  progressBarColor: '#387DFF',
  buttonPositionBottom: 0,
  buttonPositionRight: 0,
  fontFamily: '',
  customFontFamily: '',
  fontTitleFamily: '',
  customFontTitleFamily: '',
  fontButtonFamily: '',
  customFontButtonFamily: '',
  fontColor: '#000',
  bgColor: '#fff',
  secondaryButtonColor: '',
  fontSize: 14,
  fontTitleSize: 14,
  fontButtonSize: 14,
};

const PIXEL_DENSITY_MEDIUM = 2;
const PIXEL_DENSITY_HIGH = 3;
const FONT_SIZE_MEDIUM = 3;
const FONT_SIZE_LARGE = 8;
const FONT_SIZE_DEFAULT = 1;
export const webViewFontHandler = () => {
  switch (pixelDensity) {
    case PIXEL_DENSITY_MEDIUM:
      return FONT_SIZE_MEDIUM;
    case PIXEL_DENSITY_HIGH:
      return FONT_SIZE_LARGE;
    default:
      return FONT_SIZE_DEFAULT;
  }
};
