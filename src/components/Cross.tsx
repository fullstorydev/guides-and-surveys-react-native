import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const CrossBtn = ({ onColse }: { onColse: () => void }) => (
  <TouchableOpacity style={styles.crossBtn} onPress={onColse}>
    <Text style={styles.crossBtnIcon}>X</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  crossBtn: {
    width: 20,
    height: 20,
    alignItems: 'flex-end',
  },
  crossBtnIcon: {
    fontSize: 16,
    color: '#999',
  },
});
