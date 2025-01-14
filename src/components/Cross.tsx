import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../stores/useStore';

export const CrossBtn = ({ onClose }: { onClose: () => void }) => {
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
    <TouchableOpacity style={styles.crossBtn} onPress={onClose}>
      <Text style={styles.crossBtnIcon}>X</Text>
    </TouchableOpacity>
  );
};
