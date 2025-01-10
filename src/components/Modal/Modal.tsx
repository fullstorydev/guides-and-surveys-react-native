import { StyleSheet, Text, View } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { TourStep } from '../../types';
import { CrossBtn } from '../Cross';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';

type ModalProps = {
  step: TourStep;
  onColse: () => void;
};
export const Modal = ({ step, onColse }: ModalProps) => {
  const { title, actions, content } = step;
  const theme = useStore((s) => s.theme);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modal: {
          backgroundColor: theme.bgColor,
          marginTop: '50%',
          marginHorizontal: '5%',
          shadowColor: '#000000',
          shadowOpacity: 0.5,
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 8,
        },
        modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        modalFooter: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          marginTop: 10,
        },
        modalText: {
          textAlign: 'center',
          fontSize: theme.fontSize,
          color: theme.fontColor,
        },
        modalBody: {
          paddingVertical: 8,
        },
        crossBtn: {
          fontSize: 16,
          width: 20,
          height: 20,
          alignItems: 'flex-end',
        },
      }),
    [theme]
  );

  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalText}>{title}</Text>
        <CrossBtn onColse={onColse} />
      </View>
      <View style={styles.modalBody}>
        {!!content && <Body content={content} />}
      </View>
      <View style={styles.modalFooter}>
        {actions.map((action) => {
          return <Action key={action.id} {...{ action, onColse }} />;
        })}
      </View>
    </View>
  );
};
