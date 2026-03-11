import { StyleSheet, View } from 'react-native';
import { Body } from '../Body';
import { OldAction } from '../Action';
import type { TourStep } from '../../types';
import { useStore } from '../../stores/useStore';
import { useMemo } from 'react';
import { StepHeader } from '../StepHeader/StepHeader';

type Props = {
  step: TourStep;
};
export const Slideout = ({ step }: Props) => {
  const { title, actions, content } = step;
  const theme = useStore((s) => s.theme);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        slidout: {
          backgroundColor: theme.bgColor,
          marginHorizontal: '5%',
          shadowColor: '#000000',
          shadowOpacity: 0.5,
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 30,
        },
        slidoutFooter: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          marginTop: 10,
        },
        slidoutBody: {
          paddingVertical: 8,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.slidout}>
      <StepHeader {...{ title }} />
      <View style={styles.slidoutBody}>
        {!!content && <Body content={content} />}
      </View>
      <View style={styles.slidoutFooter}>
        {actions.map((action) => {
          return <OldAction key={action.id} {...{ action }} />;
        })}
      </View>
    </View>
  );
};
