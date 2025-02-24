import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../../../stores/useStore';

export const ProgressBarStepNumbers = () => {
  const tourStepIndex = useStore((s) => s.tourStepIndex) + 1;
  const tourStepLength = useStore((s) => s.tourStepLength);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{tourStepIndex}</Text>
      <Text style={styles.divider}>/</Text>
      <Text style={styles.text}>{tourStepLength}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    right: 5,
  },
  text: {
    fontSize: 16,
    color: '#999',
  },
  divider: {
    fontSize: 16,
    color: '#999',
  },
});
