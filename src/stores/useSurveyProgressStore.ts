import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SurveyProgress } from '../types';
import { SURVEY_STATE } from '../constants';

interface SurveyProgressStoreState {
  surveyProgress: SurveyProgress[];
  hasHydrated: boolean;
  isCompleted: boolean; // TODO: Refactor this once we implement uf_completed

  getSurveyProgress: (surveyId: string) => SurveyProgress | null;
  updateSurveyStarted: (
    surveyId: string,
    surveyName: string,
    initialPageId: string
  ) => void;
  updateSurveyProgress: (surveyId: string, pageId: string) => void;
  updateSurveyClosed: (surveyId: string) => void;
  updateSurveyCompleted: (surveyId: string) => void;
}

// Helper function to update existing survey progress
const updateSurveyData = (
  state: { surveyProgress: SurveyProgress[] },
  surveyId: string,
  updates: Partial<Omit<SurveyProgress, 'id' | 'updatedAt'>>
) => {
  const existingIndex = state.surveyProgress.findIndex(
    (s) => s.id === surveyId
  );

  if (existingIndex === -1) return state;

  const existing = state.surveyProgress[existingIndex]!;

  const updated = [...state.surveyProgress];
  updated[existingIndex] = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return { surveyProgress: updated };
};

export const useSurveyProgressStore = create(
  persist<SurveyProgressStoreState>(
    (set, get) => ({
      surveyProgress: [],
      hasHydrated: false,
      isCompleted: false,

      getSurveyProgress: (surveyId: string) => {
        const { surveyProgress } = get();
        return surveyProgress.find((s) => s.id === surveyId) || null;
      },
      updateSurveyStarted: (
        surveyId: string,
        surveyName: string,
        initialPageId: string
      ) => {
        set((state) => {
          const existing = state.surveyProgress.find((s) => s.id === surveyId);

          if (existing) {
            // Survey progress exists - update it to inProgress
            return updateSurveyData(state, surveyId, {
              currentPageId: initialPageId,
              state: SURVEY_STATE.IN_PROGRESS,
            });
          } else {
            // Survey progress doesn't exist - create new
            return {
              surveyProgress: [
                ...state.surveyProgress,
                {
                  id: surveyId,
                  name: surveyName,
                  currentPageId: initialPageId,
                  state: SURVEY_STATE.IN_PROGRESS,
                  updatedAt: new Date().toISOString(),
                },
              ],
            };
          }
        });
      },

      updateSurveyProgress: (surveyId: string, pageId: string) => {
        set((state) =>
          updateSurveyData(state, surveyId, {
            currentPageId: pageId,
            state: SURVEY_STATE.IN_PROGRESS,
          })
        );
      },

      updateSurveyClosed: (surveyId: string) => {
        set((state) =>
          updateSurveyData(state, surveyId, { state: SURVEY_STATE.CLOSED })
        );
      },

      updateSurveyCompleted: (surveyId: string) => {
        // TODO: implement uf_completed
        set((state) => ({
          ...updateSurveyData(state, surveyId, { state: SURVEY_STATE.CLOSED }),
          isCompleted: true,
        }));
      },
    }),
    {
      name: 'usetiful-survey-progress',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
