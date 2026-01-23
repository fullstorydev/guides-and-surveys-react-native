import { create } from 'zustand';
import type { SurveyProgress } from '../types';
import { SURVEY_STATE } from '../constants';
import { useDataStore } from './useDataStore';

interface SurveyProgressStoreState {
  isCompleted: boolean; // TODO: Refactor this once we implement uf_completed

  updateSurveyStarted: (
    surveyId: string,
    surveyName: string,
    initialPageId: string
  ) => void;
  updateSurveyProgress: (surveyId: string, pageId: string) => void;
  updateSurveyClosed: (surveyId: string) => void;
  updateSurveyCompleted: (surveyId: string) => void;
}

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

export const useSurveyProgressStore = create<SurveyProgressStoreState>(
  (set) => ({
    isCompleted: false,

    updateSurveyStarted: (
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
    },

    updateSurveyProgress: (surveyId: string, pageId: string) => {
      updateSurveyData(surveyId, {
        currentPageId: pageId,
        state: SURVEY_STATE.IN_PROGRESS,
      });
    },

    updateSurveyClosed: (surveyId: string) => {
      updateSurveyData(surveyId, { state: SURVEY_STATE.CLOSED });
    },

    updateSurveyCompleted: (surveyId: string) => {
      // TODO: implement uf_completed
      updateSurveyData(surveyId, { state: SURVEY_STATE.CLOSED });
      set({ isCompleted: true });
    },
  })
);
