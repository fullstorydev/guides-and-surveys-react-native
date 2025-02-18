import { StyleSheet, Text, View } from 'react-native';
import { CrossBtn } from '../Cross';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { RenderProgressBar } from '../ProgressBar';

type Props = {
  title: string;
  onClose: () => void;
};
export const StepHeader = ({ title, onClose }: Props) => {
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
      <View style={styles.header}>
        <Text style={styles.text}>{title}</Text>
        <CrossBtn onClose={onClose} />
      </View>
      <RenderProgressBar progress={progress} />
    </>
  );
};
