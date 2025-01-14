import { useMemo } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { useStore } from '../../../stores/useStore';

export const ProgressBarHorizontal = () => {
  const theme = useStore((s) => s.theme);
  const tourStepIndex = useStore((s) => s.tourStepIndex) + 1;
  const tourStepLength = useStore((s) => s.tourStepLength);
  const progressAmount =
    ((tourStepIndex / tourStepLength) * 100).toFixed(2) + '%';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginHorizontal: -10,
          marginTop: 5,
        },
        progress: {
          height: 3,
          width: progressAmount as DimensionValue,
          backgroundColor: theme.progressBarColor,
        },
      }),
    [progressAmount, theme.progressBarColor]
  );
  return (
    <View style={styles.container}>
      <View style={styles.progress} />
    </View>
  );
};
