import { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useOnClose } from '../hooks/useOnClose';

export const CrossBtn = () => {
  const { onCloseHandler } = useOnClose();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        crossBtn: {
          width: 20,
          height: 20,
          alignItems: 'flex-end',
        },
        crossBtnIcon: {
          width: 12,
          height: 12,
        },
      }),
    []
  );
  return (
    <TouchableOpacity style={styles.crossBtn} onPress={onCloseHandler}>
      <Image
        style={styles.crossBtnIcon}
        source={require('../assets/images/cross.png')}
      />
    </TouchableOpacity>
  );
};
