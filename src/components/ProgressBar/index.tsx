import { StyleSheet, View } from 'react-native';
import { useStore } from '../../stores/useStore';
import { ProgressBarHorizontal } from '../ProgressBar/Horizontal';
import { ProgressBarDots } from '../ProgressBar/Dots';
import { ProgressBarStepNumbers } from '../ProgressBar/StepNumbers';

export const RenderProgressBar = () => {
  const progress = useStore((s) => s.progress);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    progressContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  });

  const renderProgressBar = () => {
    if (!progress.state) return null;
    switch (progress.type) {
      case 2:
        return <ProgressBarDots />;
      case 3:
        return <ProgressBarStepNumbers />;
      case 1:
      default:
        return <ProgressBarHorizontal />;
    }
  };

  return (
    <>
      <View style={styles.header} />
      {progress.type > 1 && (
        <View style={styles.progressContainer}>{renderProgressBar()}</View>
      )}
    </>
  );
};
