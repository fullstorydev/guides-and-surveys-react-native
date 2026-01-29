import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDataJson, fetchProgressor } from '../services/api';
import { visitor } from '../services/Visitor';
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
          uf_surveys: [],
          autoSegment: '',
          customSegments: [],
          storedAt: '',
        },

        initialize: async (token, tags) => {
          try {
            // Parallel fetch for better performance
            const [visitorIdent, response, progressorData] = await Promise.all([
              visitor.getIdent(),
              fetchDataJson(token),
              tags?.userId
                ? fetchProgressor(token, tags.userId)
                : Promise.resolve(null),
            ]);

            set({
              token,
              tags: { ...tags, visitorIdent },
              tours: response?.tours || [],
              surveys: response?.surveys || [],
              progressorData: progressorData || get().progressorData,
            });
          } catch (error) {
            // TODO: send error to analytics
            console.error('Error initializing data store:', error);
          }
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
