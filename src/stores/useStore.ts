import { create } from 'zustand';
import type {
  Measure,
  ProgressorData,
  Theme,
  Tour,
  TourStep,
  UsetigulTag,
} from '../types';
import { type LayoutChangeEvent } from 'react-native';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_DEFAULT } from '../constants';
import { fetchDataJson, fetchProgressor } from '../services/api';

interface StoreState {
  token: string | undefined;
  tags: UsetigulTag | undefined;
  setToken: (token: string, tags?: UsetigulTag) => void;
  selfClosed: boolean;
  setSelfClosed: (selfClosed: boolean) => void;
  tourStepIndex: number;
  setTourStepIndex: (tourStepIndex: number) => void;
  tourStepLength: number;
  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  step: TourStep | undefined;
  setStep: (step: TourStep | undefined) => void;
  availableTour: Tour | undefined;
  setAvailableTour: (
    availableTour: Tour | undefined,
    tourStepIndex?: number
  ) => void;
  pointers: { [key: string]: Measure };
  setPointer: (id: string, pointer: LayoutChangeEvent) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  progress: { state: boolean; type: number };
  progressorHasChanged: boolean;
  setProgressorHasChanged: (progressorHasChanged: boolean) => void;
  progressorData: ProgressorData;
  setProgressorData: (progressorData: ProgressorData) => void;
  gotoTour: (tourId: string) => void;
}
type StorePersistedState = Pick<StoreState, 'progressorData'>;

export const useStore = create(
  persist<StoreState, [], [], StorePersistedState>(
    (set) => ({
      token: undefined,
      tags: undefined,
      setToken: async (token, tags) => {
        let tours: Tour[] = await fetchDataJson(token);

        if (tags && tags.userId) {
          const progressorData = await fetchProgressor(
            token,
            tags.userId ?? ''
          );
          if (progressorData) {
            set({ tours, progressorData, token, tags });
          }
        } else {
          set({ tours, token, tags });
        }
      },
      selfClosed: false,
      setSelfClosed: (selfClosed) => set({ selfClosed }),
      pointers: {},
      tourStepLength: 0,
      setPointer: (id: string, pointer: LayoutChangeEvent) => {
        pointer.target.measure((x, y, width, height, pageX, pageY) => {
          if (
            ![x, y, width, height, pageX, pageY].some((i) => i === undefined)
          ) {
            set((state) => ({
              pointers: {
                ...state.pointers,
                [id]: { x, y, width, height, pageX, pageY } as Measure,
              },
            }));
          }
        });
      },
      tourStepIndex: 0,
      setTourStepIndex: (tourStepIndex) => {
        return set((state) => {
          if (
            state.availableTour &&
            state.availableTour.steps.length - 1 >= tourStepIndex &&
            tourStepIndex >= 0
          ) {
            const newState = { ...state, tourStepIndex };

            // Set the progressorData
            const newPD = {
              ...state.progressorData,
            };
            const tour = newPD.tours?.find(
              (t) => t.id.toString() === state.availableTour?.id.toString()
            );
            if (tour) {
              tour.currentStep = tourStepIndex;
              tour.state = 'inProgress';
              newState.progressorData = newPD;
              newState.progressorHasChanged = true;
            } else {
              newPD.tours.push({
                id: state.availableTour?.id ?? '',
                state: 'inProgress',
                name: state.availableTour?.name ?? '',
                currentStep: tourStepIndex,
                updatedAt: '',
              });
              newState.progressorData = newPD;
            }

            return newState;
          } else {
            return { ...state };
          }
        });
      },
      tours: [],
      setTours: (tours) => set({ tours }),
      step: undefined,
      setStep: (step) => set({ step }),
      availableTour: undefined,
      setAvailableTour: (availableTour, tourStepIndex = 0) => {
        let theme = THEME_DEFAULT;
        if (availableTour?.themeObject) {
          theme = availableTour.themeObject;
        }
        return set({
          availableTour,
          theme,
          tourStepLength: availableTour?.steps?.length ?? 0,
          progress: {
            state: availableTour?.progress ?? false,
            type: availableTour?.progressType ?? 1,
          },
          tourStepIndex,
        });
      },
      gotoTour: (tourId) => {
        set((state) => {
          const selectedTour = state.tours.find((tour) => tour.id === tourId);
          if (selectedTour) {
            return {
              availableTour: selectedTour,
              tourStepIndex: 0,
              tourStepLength: selectedTour.steps.length ?? 0,
              progress: {
                state: selectedTour.progress ?? false,
                type: selectedTour.progressType ?? 1,
              },
              theme: selectedTour.themeObject ?? THEME_DEFAULT,
            };
          } else {
            console.error(`Tour with ID ${tourId} not found.`);
            return {};
          }
        });
      },
      theme: THEME_DEFAULT,
      setTheme: (theme) => set({ theme }),
      progress: { state: false, type: 1 },
      progressorHasChanged: false,
      setProgressorHasChanged: (progressorHasChanged) =>
        set({ progressorHasChanged }),
      progressorData: {
        uf_completed: [],
        tours: [],
        autoSegment: '',
        customSegments: [],
        storedAt: '',
      },
      setProgressorData: (progressorData) =>
        set({ progressorData, progressorHasChanged: true }),
    }),
    {
      name: 'store-state-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ progressorData: state.progressorData }),
    }
  )
);
