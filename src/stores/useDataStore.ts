import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDataJson, fetchProgressor } from '../services/api';
import type { Tour, Survey, UsetifulTag, ProgressorData } from '../types';

interface DataStoreState {
  // Raw data
  tours: Tour[];
  surveys: Survey[];
  token: string | undefined;
  tags: UsetifulTag | undefined;
  progressorData: ProgressorData;

  // Actions
  initialize: (token: string, tags?: UsetifulTag) => Promise<void>;
  setTours: (tours: Tour[]) => void;
  setSurveys: (surveys: Survey[]) => void;
  setProgressorData: (data: ProgressorData) => void;
}

type DataStorePersistedState = Pick<DataStoreState, 'progressorData'>;

export const useDataStore = create(
  subscribeWithSelector(
    persist<DataStoreState, [], [], DataStorePersistedState>(
      (set, get) => ({
        tours: [],
        surveys: [],
        token: undefined,
        tags: undefined,
        progressorData: {
          uf_completed: [],
          tours: [],
          autoSegment: '',
          customSegments: [],
          storedAt: '',
        },

        initialize: async (token, tags) => {
          set({ token, tags });

          // Parallel fetch for better performance
          const [response, progressorData] = await Promise.all([
            fetchDataJson(token),
            tags?.userId
              ? fetchProgressor(token, tags.userId)
              : Promise.resolve(null),
          ]);

          set({
            tours: response?.tours || [],
            surveys: response?.surveys || [],
            progressorData: progressorData || get().progressorData,
          });
        },

        setTours: (tours) => set({ tours }),
        setSurveys: (surveys) => set({ surveys }),
        setProgressorData: (data) => set({ progressorData: data }),
      }),
      {
        name: 'usetiful-data-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ progressorData: state.progressorData }),
      }
    )
  )
);
