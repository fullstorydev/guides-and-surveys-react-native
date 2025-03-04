import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../../../stores/useStore';

export const ProgressBarDots = () => {
  const theme = useStore((s) => s.theme);
  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const tourStepLength = useStore((s) => s.tourStepLength);
  const dynamicStyles = useMemo(
    () => ({
      active: {
        width: 21,
        backgroundColor: theme.progressBarColor,
      },
      inactive: {
        backgroundColor: theme.fontColor,
      },
    }),
    [theme.progressBarColor, theme.fontColor]
  );
  const dots = useMemo(
    () =>
      Array.from({ length: tourStepLength }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === tourStepIndex ? dynamicStyles.active : dynamicStyles.inactive,
          ]}
        />
      )),
    [
      tourStepIndex,
      tourStepLength,
      dynamicStyles.active,
      dynamicStyles.inactive,
    ]
  );

  return <View style={styles.container}>{dots}</View>;
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    right: 5,
    paddingHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
