import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import type { Survey as SurveyType } from './types';
import { CrossBtn } from './components/Cross';
import { NPS } from './components/NPS/NPS';

const Survey = ({ survey }: { survey: SurveyType }) => {
  const [closed, setClosed] = useState(false);
  // TODO default to 0 for now
  const [currentPageIndex] = useState(0);

  const { control, handleSubmit } = useForm();

  const currentPage = survey.pages[currentPageIndex];

  if (closed || !currentPage) {
    return null;
  }

  const onSubmit = (data: any) => {
    console.log('Survey submitted:', data);
    // TODO: Send to API
  };

  // Filter to only supported question types
  const supportedQuestions = currentPage.questions.filter(
    (q) => q.type === 'nps' || q.type === 'open'
  );

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {currentPage.actions.close && (
          <View style={styles.modalHeader}>
            <CrossBtn onClose={() => setClosed(true)} />
          </View>
        )}
        <View style={styles.modalBody}>
          {supportedQuestions.map((question) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.question}</Text>
              <Controller
                control={control}
                name={question.id}
                rules={{ required: question.required }}
                render={({ field: { onChange, value } }) => {
                  if (question.type === 'nps') {
                    return (
                      <NPS
                        value={value}
                        onChange={onChange}
                        leftLabel={question.minimalValueLabel}
                        rightLabel={question.maximalValueLabel}
                      />
                    );
                  }

                  // question.type === 'open'
                  return (
                    <TextInput
                      style={styles.textInput}
                      value={value || ''}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={4}
                      placeholder="Type your answer here..."
                      placeholderTextColor="#999999"
                      textAlignVertical="top"
                    />
                  );
                }}
              />
            </View>
          ))}
        </View>
        <View style={styles.modalFooter}>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>
              {currentPage.actions.label || 'Submit'}
            </Text>
          </Pressable>
        </View>
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
  modalHeader: {
    alignItems: 'flex-end',
  },
  modalBody: {
    paddingVertical: 8,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  modalFooter: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
