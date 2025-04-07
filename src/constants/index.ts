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

export const webViewFontHandler = () => {
  switch (pixelDensity) {
    case 2:
      return 3;
    case 3:
      return 8;
    default:
      return 1;
  }
};
