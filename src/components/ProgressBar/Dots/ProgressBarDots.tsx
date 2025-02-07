import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../../../stores/useStore';

export const ProgressBarDots = () => {
  const theme = useStore((s) => s.theme);
  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const tourStepLength = useStore((s) => s.tourStepLength);
  const dots = useMemo(
    () =>
      Array.from({ length: tourStepLength }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === tourStepIndex ? theme.progressBarColor : theme.fontColor,
            },
          ]}
        />
      )),
    [tourStepIndex, tourStepLength, theme.progressBarColor, theme.fontColor]
  );

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
