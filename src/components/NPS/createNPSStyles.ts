import type { Theme } from '../../types';
import { resolveFont } from '../../utils/fonts';
import { StyleSheet } from 'react-native';

export const NPS_SCALE_LENGTH = 11;
const MIN_TOUCH_TARGET = 44;
const BUTTON_MARGIN = 4;

export const createNPSStyles = (theme: Theme, containerWidth: number) => {
  const availableWidth = containerWidth;
  const totalMargins = (NPS_SCALE_LENGTH - 1) * (BUTTON_MARGIN * 2);
  const buttonWidth = (availableWidth - totalMargins) / NPS_SCALE_LENGTH;

  const shouldWrap = buttonWidth < MIN_TOUCH_TARGET;
  const buttonsPerRow = shouldWrap
    ? Math.floor(availableWidth / (MIN_TOUCH_TARGET + BUTTON_MARGIN * 2))
    : NPS_SCALE_LENGTH;
  const wrappedButtonWidth = shouldWrap
    ? (availableWidth - (buttonsPerRow - 1) * BUTTON_MARGIN * 2) / buttonsPerRow
    : buttonWidth;

  const buttonSize = Math.max(wrappedButtonWidth, MIN_TOUCH_TARGET);
  const font = resolveFont(theme.fontFamily, theme.customFontFamily);
  const surveyScaleBorderColor =
    theme.surveyScaleColor || theme.secondaryButtonColor || '#E0E0E0';
  const surveyScaleTextColor = theme.surveyScaleTextColor || theme.fontColor;

  return StyleSheet.create({
    container: {
      paddingBottom: 12,
    },
    scaleContainer: {
      flexDirection: 'row',
      flexWrap: shouldWrap ? 'wrap' : 'nowrap',
      justifyContent: shouldWrap ? 'center' : 'space-between',
      width: '100%',
    },
    questionText: {
      fontSize: theme.fontTitleSize || 16,
      fontFamily: font,
      fontWeight: '600',
      marginBottom: 12,
      color: theme.fontTitleColor || theme.fontColor,
    },
    requiredAsterisk: {
      color: '#D02E0B',
    },
    ratingButton: {
      width: buttonSize,
      height: buttonSize,
      margin: BUTTON_MARGIN,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: surveyScaleBorderColor,
      backgroundColor: theme.bgColor,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    ratingButtonSelected: {
      backgroundColor: theme.primaryColor,
      borderColor: theme.primaryColor,
      shadowOpacity: 0.2,
      elevation: 4,
    },
    ratingText: {
      fontSize: theme.fontSize || 16,
      fontFamily: font,
      fontWeight: '600',
      color: surveyScaleTextColor,
    },
    ratingTextSelected: {
      color: '#FFFFFF',
    },
    labelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 8,
      paddingHorizontal: 4,
    },
    label: {
      fontSize: theme.fontSize || 16,
      fontFamily: font,
      color: '#666666',
      maxWidth: '45%',
    },
    leftLabel: {
      textAlign: 'left',
    },
    rightLabel: {
      textAlign: 'right',
    },
  });
};
