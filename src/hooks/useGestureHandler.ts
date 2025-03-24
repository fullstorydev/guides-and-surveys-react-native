import { useMemo } from 'react';
import { PanResponder } from 'react-native';
import { useStore } from '../stores/useStore';
import { useOnClose } from './useOnClose';

const gestureWidth = 50;

export const useGestureHandler = () => {
  const step = useStore((s) => s.step);

  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const tourStepLength = useStore((s) => s.tourStepLength);
  const setTourStepIndex = useStore((s) => s.setTourStepIndex);
  const { onCloseHandler } = useOnClose();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gestureState) => {
          return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderRelease: (_evt, gestureState) => {
          const { dx } = gestureState;

          if (dx > gestureWidth) {
            if (
              step?.actions &&
              step.actions.find((a) => a.type === 'previous')
            ) {
              setTourStepIndex(tourStepIndex - 1);
            }
          } else if (dx < -gestureWidth) {
            if (step?.actions && step.actions.find((a) => a.type === 'next')) {
              if (tourStepIndex < tourStepLength - 1)
                setTourStepIndex(tourStepIndex + 1);
              else onCloseHandler();
            }
          }
        },
      }),
    [onCloseHandler, setTourStepIndex, step, tourStepIndex, tourStepLength]
  ).panHandlers;

  return panResponder;
};
