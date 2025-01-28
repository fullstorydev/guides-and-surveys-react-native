"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStore = void 0;
var _zustand = require("zustand");
const BaseURl = 'https://www.usetiful.com';
// const BaseURl = 'https://admin:admin123@dev.usetiful.com';

const END_POINT = '/api-space/data.json?lang=en&app=mobile';
const useStore = exports.useStore = (0, _zustand.create)(set => ({
  token: undefined,
  tags: undefined,
  setToken: async (token, tags) => {
    let tours = await fetchDataJson(token);
    let progressorData = null;
    if (tags && tags.userId) {
      progressorData = await fetchProgressor(token, tags.userId ?? '');
    }
    set({
      tours,
      progressorData
    });
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
    set(state => {
      if (state.availableTour && state.availableTour.steps.length - 1 >= tourStepIndex && tourStepIndex >= 0) {
        return {
          ...state,
          tourStepIndex
        };
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
  setAvailableTour: availableTour => {
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
  progressorData: null
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
    return result;
  } catch (error) {
    console.error('=======Error=====>', error.message);
    return null;
  }
};
//# sourceMappingURL=useStore.js.map