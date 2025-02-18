"use strict";

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BaseURl = 'https://www.usetiful.com';
// const BaseURl = 'https://admin:admin123@dev.usetiful.com';

const END_POINT = '/api-space/data.json?lang=en&app=mobile';
export const useStore = create(persist(set => ({
  token: undefined,
  tags: undefined,
  setToken: async (token, tags) => {
    let tours = await fetchDataJson(token);
    if (tags && tags.userId) {
      const progressorData = await fetchProgressor(token, tags.userId ?? '');
      if (progressorData) {
        set({
          tours,
          progressorData,
          token,
          tags
        });
      }
    } else {
      set({
        tours,
        token,
        tags
      });
    }
  },
  pointers: {},
  tourStepLength: 0,
  setPointer: (id, pointer) => {
    pointer.target.measure((x, y, width, height, pageX, pageY) => {
      if (![x, y, width, height, pageX, pageY].some(i => i === undefined)) {
        set(state => ({
          pointers: {
            ...state.pointers,
            [id]: {
              x,
              y,
              width,
              height,
              pageX,
              pageY
            }
          }
        }));
      }
    });
  },
  tourStepIndex: 0,
  setTourStepIndex: tourStepIndex => {
    return set(state => {
      if (state.availableTour && state.availableTour.steps.length - 1 >= tourStepIndex && tourStepIndex >= 0) {
        const newState = {
          ...state,
          tourStepIndex
        };

        // Set the profressorData
        const newPD = {
          ...state.progressorData
        };
        const tour = newPD.tours?.find(t => t.id.toString() === state.availableTour?.id.toString());
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
            updatedAt: ''
          });
          newState.progressorData = newPD;
        }
        return newState;
      } else {
        return {
          ...state
        };
      }
    });
  },
  tours: [],
  setTours: tours => set({
    tours
  }),
  availableTour: undefined,
  setAvailableTour: (availableTour, tourStepIndex = 0) => {
    let theme = THEME_DEFAULT;
    if (availableTour?.themeObject) {
      theme = availableTour?.themeObject;
    }
    return set({
      availableTour,
      theme,
      tourStepLength: availableTour?.steps?.length ?? 0,
      progress: {
        state: availableTour?.progress ?? false,
        type: availableTour?.progressType ?? 1
      },
      tourStepIndex
    });
  },
  gotoTour: tourId => {
    set(state => {
      const selectedTour = state.tours.find(tour => tour.id === tourId);
      if (selectedTour) {
        return {
          availableTour: selectedTour,
          tourStepIndex: 0,
          tourStepLength: selectedTour.steps.length ?? 0,
          progress: {
            state: selectedTour.progress ?? false,
            type: selectedTour.progressType ?? 1
          },
          theme: selectedTour.themeObject ?? THEME_DEFAULT
        };
      } else {
        console.error(`Tour with ID ${tourId} not found.`);
        return {};
      }
    });
  },
  theme: THEME_DEFAULT,
  setTheme: theme => set({
    theme
  }),
  progress: {
    state: false,
    type: 1
  },
  progressorHasChanged: false,
  setProgressorHasChanged: progressorHasChanged => set({
    progressorHasChanged
  }),
  progressorData: {
    tours: [],
    autoSegment: '',
    customSegments: [],
    storedAt: ''
  },
  setProgressorData: progressorData => set({
    progressorData,
    progressorHasChanged: true
  })
}), {
  name: 'store-state-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: state => ({
    progressorData: state.progressorData
  })
}));
const THEME_DEFAULT = {
  primaryColor: '#387DFF',
  progressBarColor: '#387DFF',
  buttonPositionBottom: 0,
  buttonPositionRight: 0,
  fontFamily: '',
  customFontFamily: '',
  fontTitleFamily: '',
  customFontTitleFamily: '',
  fontButtonFamily: '',
  customFontButtonFamily: '',
  fontColor: '#000',
  bgColor: '#fff',
  secondaryButtonColor: '',
  fontSize: 14,
  fontTitleSize: 14,
  fontButtonSize: 14
};
const fetchDataJson = async token => {
  const reqUrl = `${BaseURl}${END_POINT}`;
  try {
    const response = await fetch(reqUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      console.error(`USETIFUL HTTP ERROR - status: ${response.status}`);
      return [];
    }
    const res = await response.json();
    console.log(`
      =============================================
      =============================================
      ============== USETIFUL =====================
      ================= IS ========================
      ============== LOADED =======================
      =============================================
      =============================================`);
    return res.tours;
  } catch (error) {
    console.error('=====error====>', error.message);
    return [];
  }
};
const fetchProgressor = async (token, userId) => {
  const url = 'https://progressor.usetiful.com/api/get';
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };
  const body = JSON.stringify({
    userId,
    accountToken: token
  });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });
    if (!response.ok) {
      console.error('=======Error=====>', new Error(`Usetiful: connection error ${response.status}`));
      return null;
    }
    const result = JSON.parse(await response.json());
    const tours = JSON.parse(result.tours);
    const autoSegment = result.autoSegment;
    const storedAt = result.storedAt;
    const customSegments = result.customSegments;
    return {
      tours,
      autoSegment,
      customSegments,
      storedAt
    };
  } catch (error) {
    console.error('=======Error=====>', error.message);
    return null;
  }
};
//# sourceMappingURL=useStore.js.map