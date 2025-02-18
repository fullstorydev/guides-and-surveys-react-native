import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../stores/useStore';
import type { ProgressorData } from '../types';

export const CrossBtn = ({ onClose }: { onClose: () => void }) => {
  const progressorData = useStore((s) => s.progressorData);
  const setProgressorData = useStore((s) => s.setProgressorData);
  const availableTour = useStore((s) => s.availableTour);

  const onPressClose = () => {
    const newPD: ProgressorData = { ...progressorData };

    const tour = newPD.tours?.find(
      (t) => t.id.toString() === availableTour?.id.toString()
    );
    if (tour) {
      tour.currentStep = 0;
      tour.state = 'closed';
    } else {
      newPD.tours.push({
        id: availableTour?.id ?? '',
        state: 'closed',
        name: availableTour?.name ?? '',
        currentStep: 0,
        updatedAt: '',
      });
    }
    setProgressorData(newPD);
    onClose();
  };

  const theme = useStore((s) => s.theme);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        crossBtn: {
          width: 20,
          height: 20,
          alignItems: 'flex-end',
        },
        crossBtnIcon: {
          fontSize: 16,
          color: theme.secondaryButtonColor,
        },
      }),
    [theme]
  );
  return (
    <TouchableOpacity style={styles.crossBtn} onPress={onPressClose}>
      <Text style={styles.crossBtnIcon}>X</Text>
    </TouchableOpacity>
  );
};
