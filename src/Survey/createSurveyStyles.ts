import { StyleSheet } from 'react-native';
import type { Theme } from '../types';

export const createSurveyStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#000000cc',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.bgColor,
      width: '90%',
      maxHeight: '80%',
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
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
    modalFooter: {
      paddingTop: 8,
      paddingBottom: 8,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    keyboardAvoidingView: {
      width: '100%',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
  });
