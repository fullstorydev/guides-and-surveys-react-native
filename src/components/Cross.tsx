import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../stores/useStore';

export const CrossBtn = ({ onColse }: { onColse: () => void }) => {
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
    <TouchableOpacity style={styles.crossBtn} onPress={onColse}>
      <Text style={styles.crossBtnIcon}>X</Text>
    </TouchableOpacity>
  );
};
