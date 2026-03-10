import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useMemo } from 'react';

type Props = {
  onClose: () => void;
  color?: string;
  size?: number;
};

export const CrossBtn = ({ onClose, color, size = 16 }: Props) => {
  const styles = useMemo(() => {
    return StyleSheet.create({
      bar: {
        width: size,
        height: 1.5,
        backgroundColor: color,
        borderRadius: 1,
        position: 'absolute',
        top: size / 2 - 0.75,
      },
      crossBtn: {
        width: 20,
        height: 20,
        alignItems: 'flex-end',
        justifyContent: 'center',
      },
    });
  }, [size, color]);

  return (
    <TouchableOpacity
      style={styles.crossBtn}
      onPress={onClose}
      accessibilityLabel="Close"
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={{ width: size, height: size }}>
        <View style={[styles.bar, { transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.bar, { transform: [{ rotate: '-45deg' }] }]} />
      </View>
    </TouchableOpacity>
  );
};
