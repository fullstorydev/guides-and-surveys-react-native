import { StyleSheet } from 'react-native';
import type { Theme } from '../types';
import { resolveFont } from '../utils/fonts';

export const createSurveyStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#000000cc',
    },
    modal: {
      backgroundColor: theme.bgColor,
      marginTop: '50%',
      marginHorizontal: '5%',
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    modalHeader: {
      alignItems: 'flex-end',
    },
    modalBody: {
      paddingVertical: 8,
    },
    questionContainer: {
      marginBottom: 20,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      fontSize: theme.fontSize || 16,
      fontFamily: resolveFont(theme.fontFamily, theme.customFontFamily),
      color: theme.fontColor,
      backgroundColor: theme.bgColor,
      minHeight: 100,
    },
    modalFooter: {
      paddingTop: 8,
      paddingBottom: 8,
    },
    submitButton: {
      backgroundColor: theme.primaryColor,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontButtonSize || 16,
      fontFamily: resolveFont(
        theme.fontButtonFamily,
        theme.customFontButtonFamily
      ),
      fontWeight: '600',
    },
  });
