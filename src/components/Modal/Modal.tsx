import { StyleSheet, View } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { TourStep } from '../../types';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { StepHeader } from '../StepHeader/StepHeader';
import { StepFooter } from '../StepFooter/StepFooter';

type ModalProps = {
  step: TourStep;
  onClose: () => void;
};

export const Modal = ({ step, onClose }: ModalProps) => {
  const { title, actions, content, alignment } = step;
  const theme = useStore((s) => s.theme);

  const styles = useMemo(() => {
    const justifyContent =
      alignment === 'left'
        ? 'flex-start'
        : alignment === 'center'
          ? 'center'
          : alignment === 'right'
            ? 'flex-end'
            : 'flex-start';

    return StyleSheet.create({
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
      modalFooter: {
        flexDirection: 'row',
        justifyContent: justifyContent,
        alignItems: 'flex-start',
        marginTop: 10,
      },
      modalBody: {
        paddingVertical: 8,
      },
    });
  }, [theme, alignment]);

  return (
    <View style={styles.modal}>
      <StepHeader {...{ title, onClose }} />
      <View style={styles.modalBody}>
        {!!content && <Body content={content} />}
      </View>
      <View style={styles.modalFooter}>
        {actions.map((action) => {
          return <Action key={action.id} {...{ action, onClose }} />;
        })}
      </View>
      <StepFooter />
    </View>
  );
};
