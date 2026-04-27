import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GuidesAndSurveysApi } from '../services/api';
import { visitor } from '../services/Visitor';
import type {
  Tour,
  Survey,
  Tag,
  ProgressorData,
  SurveyProgress,
  SurveyAnswer,
} from '../types';
import { syncProgressor } from '../services/syncProgressor';
import { useReportQueueStore } from './useReportQueueStore';
import { DATA_JSON_SETTINGS } from '../constants';

interface DataStoreState {
  // Raw data
  tours: Tour[];
  surveys: Survey[];
  orgId: string | undefined;
  tags: Tag | undefined;
  visitorIdent: string | undefined;
  progressorData: ProgressorData;
  spaceToken: string | undefined;
  sessionId: string | undefined;
  guidesApi: GuidesAndSurveysApi | null;
  maskOpenTextAnswers: boolean;

  // Actions
  initialize: (
    orgId: string,
    api: GuidesAndSurveysApi,
    tags?: Tag
  ) => Promise<void>;
  refreshProgressor: () => Promise<void>;
  setSessionId: (sessionId: string) => void;
  setTours: (tours: Tour[]) => void;
  setSurveys: (surveys: Survey[]) => void;
  setProgressorData: (data: ProgressorData) => void;
  getCurrentProgressorData: () => ProgressorData;
  setTags: (tags: Tag) => void;
}

type DataStorePersistedState = Pick<
  DataStoreState,
  'progressorData' | 'visitorIdent' | 'tags'
>;

const emptyProgressorData = (): ProgressorData => ({
  uf_completed: [],
  tours: [],
  uf_surveys: [],
  uf_survey_answers: [],
  autoSegment: '',
  customSegments: [],
  storedAt: null,
  isTemporaryProfile: true,
  abExperiments: [],
  tags: [],
  progressClearedAt: null,
});

const toArray = <T>(value: T[] | string | unknown): T[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
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
      toArray(local.uf_surveys),
      toArray(server.uf_surveys)
    ),
    uf_survey_answers: mergeArrayById<SurveyAnswer>(
      toArray(local.uf_survey_answers),
      toArray(server.uf_survey_answers)
    ),
    uf_completed: mergeArrayById(
      toArray(local.uf_completed),
      toArray(server.uf_completed)
    ),
    autoSegment: server.autoSegment || local.autoSegment || '',
    customSegments: server.customSegments || local.customSegments || [],
    storedAt: server.storedAt || local.storedAt || null,
    isTemporaryProfile:
      server.isTemporaryProfile ?? local.isTemporaryProfile ?? true,
    abExperiments: server.abExperiments || local.abExperiments || [],
    tags: toArray(server.tags) || local.tags || [],
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
        orgId: undefined,
        tags: undefined,
        visitorIdent: undefined,
        progressorData: emptyProgressorData(),
        spaceToken: undefined,
        sessionId: undefined,
        guidesApi: null,
        maskOpenTextAnswers: true,

        getCurrentProgressorData: () => {
          return get().progressorData;
        },

        initialize: async (orgId, api, tags) => {
          try {
            set({ guidesApi: api });

            let visitorIdent = get().visitorIdent;
            if (!visitorIdent) {
              visitorIdent = await visitor.getIdent();
              set({ visitorIdent });
            }

            const persistedUserId = get().tags?.userId;
            const resolvedUserId = tags?.userId ?? persistedUserId;

            const response = await api.fetchDataJson(orgId);
            const spaceToken = response?.spaceToken || '';
            const maskOpenTextAnswers =
              response?.settings?.find(
                (s) => s.name === DATA_JSON_SETTINGS.maskOpenTextAnswers
              )?.value !== false;

            set({
              orgId,
              spaceToken,
              maskOpenTextAnswers,
              tags: {
                ...tags,
                visitorIdent,
                ...(resolvedUserId && { userId: resolvedUserId }),
              },
              tours: response?.tours || [],
              surveys: response?.surveys || [],
            });

            if (!spaceToken) {
              throw new Error('Space token not found');
            }
            await useReportQueueStore.getState().processQueue(spaceToken, api);
          } catch (error) {
            // TODO: send error to analytics
            console.error('Error initializing data store:', error);
          }
        },

        refreshProgressor: async () => {
          const { spaceToken, sessionId, tags, guidesApi } = get();
          if (!spaceToken || !sessionId || !guidesApi) return;

          const userId = tags?.userId;

          try {
            const localProgressorData = get().progressorData;
            console.log(
              `GuidesAndSurveys: refreshProgressor with spaceToken: ${spaceToken} and sessionId: ${sessionId}, userId: ${userId}`
            );
            const serverProgressorData = await guidesApi.fetchProgressor(
              spaceToken,
              sessionId,
              userId
            );

            if (
              serverProgressorData &&
              !serverProgressorData.isTemporaryProfile
            ) {
              const mergedProgressorData = mergeProgressorData(
                localProgressorData,
                serverProgressorData
              );

              set({ progressorData: mergedProgressorData });

              if (
                JSON.stringify(mergedProgressorData) !==
                JSON.stringify(serverProgressorData)
              ) {
                syncProgressor(
                  mergedProgressorData,
                  spaceToken,
                  sessionId,
                  guidesApi,
                  userId,
                  0
                );
              }
            }
          } catch (error) {
            // TODO: send error to analytics
            console.error('Error refreshing progressor:', error);
          }
        },

        setTags: (tags) =>
          set((state) => ({ tags: { ...state.tags, ...tags } })),

        setSessionId: (sessionId) => set({ sessionId }),

        setTours: (tours) => set({ tours }),
        setSurveys: (surveys) => set({ surveys }),
        setProgressorData: (data) => {
          const { sessionId, spaceToken, guidesApi, tags } = get();
          set({ progressorData: data });

          // isTemporaryProfile is required to be false to sync progressor data
          if (
            !data.isTemporaryProfile &&
            sessionId &&
            spaceToken &&
            guidesApi
          ) {
            syncProgressor(
              data,
              spaceToken,
              sessionId,
              guidesApi,
              tags?.userId
            );
          }
        },
      }),
      {
        name: 'fullstory-guides-and-surveys-data-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          progressorData: state.progressorData,
          visitorIdent: state.visitorIdent,
          tags: state.tags,
        }),
      }
    )
  )
);

useDataStore.subscribe(
  (state) => ({
    spaceToken: state.spaceToken,
    sessionId: state.sessionId,
    userId: state.tags?.userId,
  }),
  () => {
    const { spaceToken, sessionId } = useDataStore.getState();
    if (spaceToken && sessionId) {
      useDataStore.getState().refreshProgressor();
    }
  },
  { equalityFn: shallow }
);
