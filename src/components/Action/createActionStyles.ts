import { StyleSheet } from 'react-native';
import type { Theme } from '../../types';
import { resolveFont } from '../../utils/fonts';

export const createActionStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: 1,
    },
    buttonPrimary: {
      backgroundColor: theme.primaryColor,
      borderColor: theme.primaryColor,
    },
    buttonSecondary: {
      backgroundColor: theme.bgColor,
      borderColor: theme.secondaryButtonColor,
    },
    buttonText: {
      fontSize: theme.fontButtonSize || 16,
      fontFamily: resolveFont(
        theme.fontButtonFamily,
        theme.customFontButtonFamily
      ),
      fontWeight: '600',
    },
    buttonTextPrimary: {
      color: '#FFFFFF',
    },
    buttonTextSecondary: {
      color: theme.secondaryButtonColor,
    },
  });
