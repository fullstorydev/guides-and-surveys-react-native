import { StyleSheet, Text, View } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { TourStep } from '../../types';
import { CrossBtn } from '../Cross';

type Props = {
  step: TourStep;
  onColse: () => void;
};
export const Slideout = ({ step, onColse }: Props) => {
  const { title, actions, content } = step;

  return (
    <View style={styles.slidout}>
      <View style={styles.slidoutHeader}>
        <Text style={styles.slidoutText}>{title}</Text>
        <CrossBtn onColse={onColse} />
      </View>
      <View style={styles.slidoutBody}>
        {!!content && <Body content={content} />}
      </View>
      <View style={styles.slidoutFooter}>
        {actions.map((action) => {
          return <Action key={action.id} {...{ action, onColse }} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slidout: {
    backgroundColor: '#fff',
    marginHorizontal: '5%',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 30,
  },
  slidoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  slidoutFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  slidoutText: {
    textAlign: 'center',
  },
  slidoutBody: {
    paddingVertical: 8,
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
  },
});
