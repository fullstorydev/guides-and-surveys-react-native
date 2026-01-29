import type { SurveyProgress } from '../../types';
import { SURVEY_STATE } from '../../constants';
import { useDataStore } from '../useDataStore';

// Helper function to update survey progress in useDataStore
const updateSurveyData = (
  surveyId: string,
  updates: Partial<Omit<SurveyProgress, 'id' | 'updatedAt'>>
) => {
  const progressorData = useDataStore.getState().progressorData;
  const uf_surveys = progressorData.uf_surveys || [];

  const existingIndex = uf_surveys.findIndex((s) => s.id === surveyId);
  if (existingIndex === -1) return;

  const existing = uf_surveys[existingIndex]!;
  const updated = [...uf_surveys];
  updated[existingIndex] = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  useDataStore.getState().setProgressorData({
    ...progressorData,
    uf_surveys: updated,
  });
};

export const updateSurveyStarted = (
  surveyId: string,
  surveyName: string,
  initialPageId: string
) => {
  const progressorData = useDataStore.getState().progressorData;
  const uf_surveys = progressorData.uf_surveys || [];
  const existing = uf_surveys.find((s) => s.id === surveyId);

  if (existing) {
    // Survey progress exists - update it to inProgress
    updateSurveyData(surveyId, {
      currentPageId: initialPageId,
      state: SURVEY_STATE.IN_PROGRESS,
    });
  } else {
    // Survey progress doesn't exist - create new
    useDataStore.getState().setProgressorData({
      ...progressorData,
      uf_surveys: [
        ...uf_surveys,
        {
          id: surveyId,
          name: surveyName,
          currentPageId: initialPageId,
          state: SURVEY_STATE.IN_PROGRESS,
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  }
};

export const updateSurveyProgress = (surveyId: string, pageId: string) => {
  updateSurveyData(surveyId, {
    currentPageId: pageId,
    state: SURVEY_STATE.IN_PROGRESS,
  });
};

export const updateSurveyClosed = (surveyId: string) => {
  updateSurveyData(surveyId, { state: SURVEY_STATE.CLOSED });
};

export const updateSurveyCompleted = (surveyId: string) => {
  const progressorData = useDataStore.getState().progressorData;
  const uf_completed = progressorData.uf_completed || [];
  const newUfCompleted = [
    ...uf_completed,
    {
      type: 'survey' as const,
      id: surveyId,
      updatedAt: new Date().toISOString(),
    },
  ];

  useDataStore.getState().setProgressorData({
    ...progressorData,
    uf_completed: newUfCompleted,
  });

  updateSurveyData(surveyId, { state: SURVEY_STATE.CLOSED });
};
