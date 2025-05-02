import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { TourStep } from '../../types';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { StepHeader } from '../StepHeader/StepHeader';
import { RenderProgressBar } from '../ProgressBar';

type ModalProps = {
  step: TourStep;
};

export const Modal = ({ step }: ModalProps) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = height < width;
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
        marginTop: isLandscape ? '20%' : '50%',
        marginHorizontal: '5%',
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
      },
      modalActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: justifyContent,
        alignItems: 'flex-start',
        marginTop: 10,
      },
      modalBody: {
        paddingVertical: 8,
      },
    });
  }, [alignment, theme.bgColor, isLandscape]);

  return (
    <View style={styles.modal}>
      <StepHeader {...{ title }} />
      <View style={styles.modalBody}>
        {!!content && <Body content={content} />}
      </View>
      <View style={styles.modalActions}>
        {actions.map((action) => {
          return <Action key={action.id} {...{ action }} />;
        })}
      </View>
      <RenderProgressBar />
    </View>
  );
};
