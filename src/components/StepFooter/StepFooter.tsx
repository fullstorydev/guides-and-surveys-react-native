import { StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { RenderProgressBar } from '../ProgressBar';

export const StepFooter = () => {
  const theme = useStore((s) => s.theme);
  const progress = useStore((s) => s.progress);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        text: {
          textAlign: 'center',
          fontSize: theme.fontSize,
          color: theme.fontColor,
        },
      }),
    [theme]
  );

  return (
    <>
      <View style={styles.header} />
      {progress.type > 1 && <RenderProgressBar progress={progress} />}
    </>
  );
};
