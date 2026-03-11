import { StyleSheet } from 'react-native';
import type { Theme } from '../../types';
import { resolveFont } from '../../utils/fonts';

const withAlpha = (hexColor: string, alpha: number) => {
  const normalized = hexColor.trim();
  if (!normalized) {
    return '#E0E0E0';
  }

  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `${normalized}${alphaHex}`;
};

export const createOpenQuestionStyles = (
  theme: Theme,
  titleAlignment: 'left' | 'right' | 'center'
) => {
  const font = resolveFont(theme.fontFamily, theme.customFontFamily);
  const textInputBorderColor = withAlpha(theme.secondaryButtonColor, 0.3);
  const textInputFocusBorderColor = theme.secondaryButtonColor;

  return StyleSheet.create({
    container: {
      paddingBottom: 12,
    },
    questionText: {
      fontSize: theme.fontSize || 16,
      fontFamily: font,
      fontWeight: '600',
      marginBottom: 12,
      color: theme.fontContentColor,
      textAlign: titleAlignment,
    },
    requiredAsterisk: {
      color: '#D02E0B',
    },
    textInput: {
      borderWidth: 1,
      borderColor: textInputBorderColor,
      borderRadius: 8,
      padding: 12,
      fontSize: theme.fontSize || 16,
      fontFamily: font,
      color: theme.fontColor,
      backgroundColor: theme.bgColor,
      minHeight: 100,
    },
    textInputFocused: {
      borderColor: textInputFocusBorderColor,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
  });
};
