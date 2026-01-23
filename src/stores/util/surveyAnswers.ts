import type { SurveyAnswer } from '../../types';
import { useDataStore } from '../useDataStore';

export const saveSurveyAnswer = (
  surveyId: string,
  questionId: string,
  questionType: string,
  value: string | number | number[],
  pageId: string,
  pageName?: string
) => {
  const progressorData = useDataStore.getState().progressorData;
  const uf_survey_answers = progressorData.uf_survey_answers || [];

  const answer: SurveyAnswer = {
    id: `${surveyId}_${questionId}_${Date.now()}`,
    updatedAt: new Date().toISOString(),
    surveyId,
    questionId,
    questionType,
    pageId,
    pageName,
  };

  // TODO: add other question types
  if (questionType === 'nps') {
    answer.optionValue =
      typeof value === 'number' ? value : parseInt(value as string, 10);
  } else if (questionType === 'open') {
    answer.answerText = String(value);
  }

  useDataStore.getState().setProgressorData({
    ...progressorData,
    uf_survey_answers: [...uf_survey_answers, answer],
  });
};

export const getSurveyAnswers = (surveyId: string): SurveyAnswer[] => {
  const progressorData = useDataStore.getState().progressorData;
  return (progressorData.uf_survey_answers || []).filter(
    (answer) => answer.surveyId === surveyId
  );
};
