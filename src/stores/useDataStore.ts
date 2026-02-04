import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDataJson, fetchProgressor } from '../services/api';
import { visitor } from '../services/Visitor';
import type {
  Tour,
  Survey,
  UsetifulTag,
  ProgressorData,
  SurveyProgress,
  SurveyAnswer,
} from '../types';
import { syncProgressor } from '../services/syncProgressor';

interface DataStoreState {
  // Raw data
  tours: Tour[];
  surveys: Survey[];
  token: string | undefined;
  tags: UsetifulTag | undefined;
  visitorIdent: string | undefined;
  // User-scoped progressor data: key = userId (or anonymous)
  progressorDataByUser: Record<string, ProgressorData>;

  // Actions
  initialize: (token: string, tags?: UsetifulTag) => Promise<void>;
  setTours: (tours: Tour[]) => void;
  setSurveys: (surveys: Survey[]) => void;
  setProgressorData: (data: ProgressorData) => void;
  getCurrentProgressorData: () => ProgressorData;
}

type DataStorePersistedState = Pick<
  DataStoreState,
  'progressorDataByUser' | 'visitorIdent'
>;

const emptyProgressorData = (): ProgressorData => ({
  uf_completed: [],
  tours: [],
  uf_surveys: [],
  uf_survey_answers: [],
  autoSegment: '',
  customSegments: [],
  storedAt: '',
  isTemporaryProfile: false,
  abExperiments: [],
  tags: [],
  progressClearedAt: null,
});

/**
 * Gets the storage key for current user's progressor data.
 * Returns userId if authenticated, otherwise "anonymous" for device-level storage.
 */
const getUserKey = (tags?: UsetifulTag): string => {
  return tags?.userId || 'anonymous';
};

/**
 * Merges local and server progressor data, keeping whichever has newer updatedAt timestamps.
 * This prevents data loss when sync fails and app restarts.
 */
const mergeProgressorData = (
  local: ProgressorData,
  server: ProgressorData
): ProgressorData => {
  // Helper to merge arrays by ID, keeping items with newer updatedAt
  const mergeArrayById = <T extends { id: string; updatedAt?: string }>(
    localArr: T[],
    serverArr: T[]
  ): T[] => {
    // NOTE: If server deletes an item, but local has it, it will be kept and synced.
    const merged = new Map<string, T>();

    // Add server items first
    serverArr.forEach((item) => merged.set(item.id, item));

    // Override with local items if they're newer
    localArr.forEach((item) => {
      const existing = merged.get(item.id);
      if (!existing) {
        merged.set(item.id, item);
      } else if (item.updatedAt && existing.updatedAt) {
        // Keep whichever has newer timestamp
        if (new Date(item.updatedAt) > new Date(existing.updatedAt)) {
          merged.set(item.id, item);
        }
      } else {
        // If we can't compare timestamps, prefer local (current session)
        merged.set(item.id, item);
      }
    });

    return Array.from(merged.values());
  };

  return {
    tours: server.tours || local.tours || [],
    uf_surveys: mergeArrayById<SurveyProgress>(
      local.uf_surveys || [],
      server.uf_surveys || []
    ),
    uf_survey_answers: mergeArrayById<SurveyAnswer>(
      local.uf_survey_answers || [],
      server.uf_survey_answers || []
    ),
    uf_completed: mergeArrayById(
      local.uf_completed || [],
      server.uf_completed || []
    ),
    autoSegment: server.autoSegment || local.autoSegment || '',
    customSegments: server.customSegments || local.customSegments || [],
    storedAt: server.storedAt || local.storedAt || '',
    isTemporaryProfile:
      server.isTemporaryProfile ?? local.isTemporaryProfile ?? false,
    abExperiments: server.abExperiments || local.abExperiments || [],
    tags: server.tags || local.tags || [],
    progressClearedAt:
      server.progressClearedAt ?? local.progressClearedAt ?? null,
  };
};

export const useDataStore = create(
  subscribeWithSelector(
    persist<DataStoreState, [], [], DataStorePersistedState>(
      (set, get) => ({
        tours: [],
        surveys: [],
        token: undefined,
        tags: undefined,
        visitorIdent: undefined,
        progressorDataByUser: {},

        getCurrentProgressorData: () => {
          const userKey = getUserKey(get().tags);
          return get().progressorDataByUser[userKey] || emptyProgressorData();
        },

        initialize: async (token, tags) => {
          try {
            let visitorIdent = get().visitorIdent;
            if (!visitorIdent) {
              visitorIdent = await visitor.getIdent();
              set({ visitorIdent });
            }

            const [response, serverProgressorData] = await Promise.all([
              fetchDataJson(token),
              tags?.userId
                ? fetchProgressor(token, tags.userId)
                : Promise.resolve(null),
            ]);

            const userKey = getUserKey(tags);

            const localProgressorData =
              get().progressorDataByUser[userKey] || emptyProgressorData();

            const mergedProgressorData = serverProgressorData
              ? mergeProgressorData(localProgressorData, serverProgressorData)
              : localProgressorData;

            set({
              token,
              tags: { ...tags, visitorIdent },
              tours: response?.tours || [],
              surveys: response?.surveys || [],
              progressorDataByUser: {
                ...get().progressorDataByUser,
                [userKey]: mergedProgressorData,
              },
            });

            if (
              serverProgressorData &&
              tags?.userId &&
              JSON.stringify(mergedProgressorData) !==
                JSON.stringify(serverProgressorData)
            ) {
              syncProgressor(mergedProgressorData, token, tags.userId, 0);
            }
          } catch (error) {
            // TODO: send error to analytics
            console.error('Error initializing data store:', error);
          }
        },

        setTours: (tours) => set({ tours }),
        setSurveys: (surveys) => set({ surveys }),
        setProgressorData: (data) => {
          const tags = get().tags;
          const token = get().token;
          const userKey = getUserKey(tags);

          set({
            progressorDataByUser: {
              ...get().progressorDataByUser,
              [userKey]: data,
            },
          });

          // Sync only if user has userId
          if (tags?.userId && token) {
            syncProgressor(data, token, tags.userId);
          }
        },
      }),
      {
        name: 'usetiful-data-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          progressorDataByUser: state.progressorDataByUser,
          visitorIdent: state.visitorIdent,
        }),
      }
    )
  )
);
