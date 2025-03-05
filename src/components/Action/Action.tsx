import { useMemo } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { ActionType } from '../../types';
import { useStore } from '../../stores/useStore';
import { useOnClose } from '../../hooks/useOnClose';

type ActionProps = {
  action: ActionType;
};
export const USAction = ({ action }: ActionProps) => {
  const { styleType, type, value, tourId, url, to } = action;
  const theme = useStore((s) => s.theme);

  const setTourStepIndex = useStore((s) => s.setTourStepIndex);
  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const tourStepLength = useStore((s) => s.tourStepLength);
  const gotoTour = useStore((s) => s.gotoTour);
  const availableTour = useStore((s) => s.availableTour);
  const { onCloseHandler } = useOnClose();

  const onPress = useMemo(() => {
    switch (type) {
      case 'next':
        if (tourStepIndex < tourStepLength - 1)
          return () => setTourStepIndex(tourStepIndex + 1);
        else return onCloseHandler;
      case 'previous':
        return () => setTourStepIndex(tourStepIndex - 1);
      case 'gototour':
        return () => gotoTour(tourId);
      case 'goto':
        return () => {
          if (typeof url === 'string' && url.startsWith('http')) {
            Linking.openURL(url).catch((err) =>
              console.error('Failed to open URL:', err)
            );
          }
        };
      case 'jump':
        return () => {
          if (!availableTour || !availableTour.steps) return;
          const stepIndex = availableTour.steps.findIndex(
            (step) => parseInt(step.id, 10) === parseInt(to, 10)
          );
          if (stepIndex !== -1) {
            setTourStepIndex(stepIndex);
          }
        };
      default:
        return onCloseHandler;
    }
  }, [
    type,
    tourStepIndex,
    tourStepLength,
    setTourStepIndex,
    gotoTour,
    tourId,
    url,
    availableTour,
    to,
    onCloseHandler,
  ]);

  const btnStyles = useMemo(
    () =>
      StyleSheet.create({
        footerBtn: {
          marginRight: 10,
          padding: 8,
          borderRadius: 6,
        },
        primaryBtn: {
          backgroundColor: theme.primaryColor,
          color: '#fff',
          borderWidth: 0,
        },
        secondaryBtn: {
          borderColor: theme.secondaryButtonColor,
          borderWidth: 1,
        },
      }),
    [theme]
  );

  const textStyles = useMemo(
    () =>
      StyleSheet.create({
        footerBtn: {
          fontWeight: '500',
          fontSize: theme.fontButtonSize,
        },
        primaryBtn: {
          color: '#fff',
        },
        secondaryBtn: {
          color: theme.secondaryButtonColor,
        },
      }),
    [theme]
  );

  const textStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return { ...textStyles.footerBtn, ...textStyles.primaryBtn };
      case 'Secondary':
        return { ...textStyles.footerBtn, ...textStyles.secondaryBtn };
      default:
        return { ...textStyles.footerBtn };
    }
  }, [
    styleType,
    textStyles.footerBtn,
    textStyles.primaryBtn,
    textStyles.secondaryBtn,
  ]);
  const btnStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return { ...btnStyles.footerBtn, ...btnStyles.primaryBtn };
      case 'Secondary':
        return { ...btnStyles.footerBtn, ...btnStyles.secondaryBtn };
      default:
        return { ...btnStyles.footerBtn };
    }
  }, [
    btnStyles.footerBtn,
    btnStyles.primaryBtn,
    btnStyles.secondaryBtn,
    styleType,
  ]);

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress}>
      <Text style={textStyle}>{value}</Text>
    </TouchableOpacity>
  );
};
