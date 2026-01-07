import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Measure, UsetifulTag } from './types';
import { Modal } from './components/Modal';
import { useStore } from './stores/useStore';
import { Pointer } from './components/Pointer';
import { Slideout } from './components/Slideout';
import { useCurrentRouteName } from './hooks/useCurrentRouteName';
import { useTargetting } from './hooks/useTargetting';
import { useProgressorUpdate } from './hooks/useProgressorUpdate';
import { useGestureHandler } from './hooks/useGestureHandler';

type Props = {
  token: string;
  tags?: UsetifulTag;
} & PropsWithChildren;

export const Usetiful = ({ children, token, tags }: Props) => {
  const currentRouteName = useCurrentRouteName();

  const tourStepIndex = useStore((s) => s.tourStepIndex);

  const step = useStore((s) => s.step);
  const setStep = useStore((s) => s.setStep);
  const initialize = useStore((s) => s.initialize);
  const availableTour = useStore((s) => s.availableTour);
  const selfClosed = useStore((s) => s.selfClosed);
  const setSelfClosed = useStore((s) => s.setSelfClosed);
  const [layoutMeasure, setLayoutMeasure] = useState<Measure>();
  useEffect(() => {
    initialize(token, tags);
  }, [initialize, tags, token]);

  useTargetting();
  useProgressorUpdate();

  useEffect(() => {
    setSelfClosed(false);
  }, [currentRouteName, setSelfClosed]);

  useEffect(
    () =>
      setStep(
        !!availableTour && !selfClosed && availableTour.steps[tourStepIndex]
          ? availableTour.steps[tourStepIndex]
          : undefined
      ),
    [availableTour, selfClosed, setStep, tourStepIndex]
  );

  const panHandlers = useGestureHandler();

  const refs = useStore((s) => s.pointers);
  const stepType = useMemo(() => {
    if (step && step.type !== 'pointer') return step.type;
    else if (step?.type === 'pointer')
      return refs[step.element] ? 'pointer' : 'slideout';
    else return undefined;
  }, [refs, step]);

  return (
    <View
      style={styles.UsetifulContainer}
      onLayout={(e) => {
        e.target.measure((x, y, width, height, pageX, pageY) => {
          if (
            ![x, y, width, height, pageX, pageY].some((i) => i === undefined)
          ) {
            setLayoutMeasure({ x, y, width, height, pageX, pageY } as Measure);
          }
        });
      }}
    >
      {children}
      {step && (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.usetifulLayer,
            backgroundColor: stepType === 'modal' ? '#000000cc' : 'transparent',
            justifyContent: stepType === 'slideout' ? 'flex-end' : 'flex-start',
          }}
          {...panHandlers}
        >
          {stepType === 'modal' && (
            <Modal step={step} key={`${stepType}-${step.id}`} />
          )}
          {stepType === 'pointer' && (
            <Pointer
              step={step}
              layoutMeasure={layoutMeasure}
              key={`${stepType}-${step.id}`}
            />
          )}
          {stepType === 'slideout' && (
            <Slideout step={step} key={`${stepType}-${step.id}`} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  UsetifulContainer: {
    flex: 1,
  },
  usetifulLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
});
