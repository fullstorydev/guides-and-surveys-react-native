import type { Theme } from '../../types';
import { resolveFont } from '../../utils/fonts';
import { StyleSheet } from 'react-native';

export const NPS_SCALE_LENGTH = 11;
const TOUCH_TARGET = 44;
const BUTTON_MARGIN = 4;

// When wrapping, split into two rows: ROW1_COUNT on the first, remainder on the second.
export const NPS_ROW1_COUNT = 6;

export const createNPSStyles = (
  theme: Theme,
  containerWidth: number,
  titleAlignment: 'left' | 'right' | 'center'
) => {
  const canFitSingleRow =
    containerWidth >= (TOUCH_TARGET + BUTTON_MARGIN * 2) * NPS_SCALE_LENGTH;
  const shouldWrap = !canFitSingleRow;

  const font = resolveFont(theme.fontFamily, theme.customFontFamily);
  const surveyScaleBorderColor =
    theme.surveyScaleColor || theme.secondaryButtonColor || '#E0E0E0';
  const surveyScaleTextColor = theme.surveyScaleTextColor || theme.fontColor;

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 12,
    },
    scaleContainer: {
      flexDirection: 'column',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'transparent',
      paddingVertical: 6,
    },
    scaleRow: {
      flexDirection: 'row',
      justifyContent: shouldWrap ? 'center' : 'space-between',
    },
    scaleContainerError: {
      borderColor: '#D02E0B',
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
    ratingButton: {
      width: TOUCH_TARGET,
      height: TOUCH_TARGET,
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

  return { styles, shouldWrap };
};
