import { StyleSheet } from 'react-native';
import type { Theme } from '../../types';
import { resolveFont } from '../../utils/fonts';

export const createNPSStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    scaleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
    },
    ratingButton: {
      flex: 1,
      aspectRatio: 1,
      marginHorizontal: 2,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      backgroundColor: theme.bgColor,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 32,
      minHeight: 32,
    },
    ratingButtonSelected: {
      backgroundColor: theme.primaryColor,
      borderColor: theme.primaryColor,
    },
    ratingText: {
      fontSize: theme.fontSize || 16,
      fontFamily: resolveFont(theme.fontFamily, theme.customFontFamily),
      fontWeight: '600',
      color: theme.fontColor,
    },
    ratingTextSelected: {
      color: '#FFFFFF',
    },
    labelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 8,
    },
    label: {
      fontSize: (theme.fontSize || 16) * 0.75,
      fontFamily: resolveFont(theme.fontFamily, theme.customFontFamily),
      color: theme.fontColor,
    },
    leftLabel: {
      textAlign: 'left',
    },
    rightLabel: {
      textAlign: 'right',
    },
  });
