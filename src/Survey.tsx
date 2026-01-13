import { StyleSheet, Text, View } from 'react-native';
import type { Survey as SurveyType } from './types';
import { StepHeader } from './components/StepHeader/StepHeader';

const Survey = ({ survey }: { survey: SurveyType }) => {
  //TODO implement survey
  console.log('survey', survey);
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <StepHeader {...{ title: 'placeholder' }} />
        <Text>Survey</Text>
      </View>
    </View>
  );
};

export default Survey;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
  modal: {
    backgroundColor: 'white',
    marginTop: '50%',
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
    alignItems: 'flex-start',
    marginTop: 10,
  },
  modalBody: {
    paddingVertical: 8,
  },
});
