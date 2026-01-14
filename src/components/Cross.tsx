import { Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onClose: () => void;
};

export const CrossBtn = ({ onClose }: Props) => {
  return (
    <TouchableOpacity style={styles.crossBtn} onPress={onClose}>
      <Image
        style={styles.crossBtnIcon}
        source={require('../assets/images/cross.png')}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  crossBtn: {
    width: 20,
    height: 20,
    alignItems: 'flex-end',
  },
  crossBtnIcon: {
    width: 12,
    height: 12,
  },
});
