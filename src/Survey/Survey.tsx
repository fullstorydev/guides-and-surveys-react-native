import { useEffect, useMemo } from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { type Survey as SurveyType, SURVEY_ACTION_TYPES } from '../types';
import { CrossBtn } from '../components/Cross';
import { NPS } from '../components/NPS/NPS';
import {
  updateSurveyStarted,
  updateSurveyProgress,
  updateSurveyClosed,
  updateSurveyCompleted,
} from '../stores/util/surveyProgress';
import { saveSurveyAnswer } from '../stores/util/surveyAnswers';
import { useActiveExperienceStore } from '../stores/useActiveExperienceStore';
import { useDataStore } from '../stores/useDataStore';
import { createSurveyStyles } from './createSurveyStyles';

const Survey = ({ survey }: { survey: SurveyType }) => {
  const selfClosed = useActiveExperienceStore((s) => s.selfClosed);
  const setSelfClosed = useActiveExperienceStore((s) => s.setSelfClosed);
  const theme = useActiveExperienceStore((s) => s.theme);

  const { control, handleSubmit } = useForm();

  const surveyProgress = useDataStore((s) =>
    s.getCurrentProgressorData().uf_surveys?.find((sp) => sp.id === survey.id)
  );

  const currentPageIndex = useMemo(
    () =>
      surveyProgress
        ? survey.pages.findIndex((p) => p.id === surveyProgress.currentPageId)
        : 0,
    [survey.pages, surveyProgress]
  );

  const currentPage = useMemo(
    () =>
      currentPageIndex >= 0 ? survey.pages[currentPageIndex] : survey.pages[0],
    [survey.pages, currentPageIndex]
  );

  // Initialize survey in store if it's new
  useEffect(() => {
    if (surveyProgress) {
      return;
    }

    const firstPage = survey.pages[0];
    if (!firstPage || !firstPage.id) {
      console.error(`Survey ${survey.id} has no pages or first page has no ID`);
      return;
    }

    updateSurveyStarted(survey.id, survey.name, firstPage.id);
  }, [survey.id, survey.name, survey.pages, surveyProgress]);

  // Filter to only supported question types
  const supportedQuestions =
    currentPage?.questions.filter(
      (q) => q.type === 'nps' || q.type === 'open'
    ) || [];

  const onSubmit = (data: any) => {
    if (!currentPage) {
      return;
    }

    // Save each answer
    Object.entries(data).forEach(([questionId, value]) => {
      const question = supportedQuestions.find((q) => q.id === questionId);
      if (question && value !== undefined && value !== null && value !== '') {
        saveSurveyAnswer(
          survey.id,
          questionId,
          question.type,
          value as string | number,
          currentPage.id,
          currentPage.name
        );
      }
    });

    const nextPageIndex = currentPageIndex + 1;
    const nextPage = survey.pages[nextPageIndex];

    if (nextPage) {
      updateSurveyProgress(survey.id, nextPage.id);
    } else {
      updateSurveyCompleted(survey.id);
    }
  };

  const styles = useMemo(() => createSurveyStyles(theme), [theme]);

  // Don't show if:
  // - No valid page to display
  // - User closed this survey in current session
  if (!currentPage || selfClosed) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {currentPage.closeButton && (
          <View style={styles.modalHeader}>
            <CrossBtn
              onClose={() => {
                updateSurveyClosed(survey.id);
                setSelfClosed(true);
              }}
            />
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
                        theme={theme}
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
          {currentPage.actions.map((action) => {
            const handleActionPress = () => {
              if (action.type === SURVEY_ACTION_TYPES.CONFIRM_SURVEY) {
                handleSubmit(onSubmit)();
              } else if (action.type === SURVEY_ACTION_TYPES.CLOSE_SURVEY) {
                updateSurveyClosed(survey.id);
                setSelfClosed(true);
              } else {
                setSelfClosed(true);
              }
            };

            return (
              <Pressable
                style={styles.submitButton}
                key={action.id}
                onPress={handleActionPress}
              >
                <Text style={styles.submitButtonText}>{action.value}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Survey;
