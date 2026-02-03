import { Platform } from 'react-native';

const FONT_MAP: Record<string, { ios: string; android: string }> = {
  'Arial': { ios: 'Arial', android: 'sans-serif' },
  'Courier New': { ios: 'Courier New', android: 'monospace' },
  'Times New Roman': { ios: 'Times New Roman', android: 'serif' },
  'Verdana': { ios: 'Verdana', android: 'sans-serif' },
};

export const resolveFont = (
  fontFamily: string,
  customFont?: string
): string | undefined => {
  if (fontFamily.toLowerCase() === 'custom' && customFont) {
    return customFont;
  }

  if (fontFamily.toLowerCase() === 'default' || fontFamily === '') {
    return undefined;
  }
  const platform = Platform.OS;
  if (platform !== 'ios' && platform !== 'android') {
    return undefined;
  }
  return FONT_MAP[fontFamily]?.[platform];
};
