"use strict";

import { create } from 'zustand';
export const useStore = create(set => ({
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
      tourStepLength: availableTour?.steps?.length ?? 0
    });
  },
  theme: THEME_DEFAULT,
  setTheme: theme => set({
    theme
  })
}));
const THEME_DEFAULT = {
  primaryColor: '#387DFF',
  progressBarColor: '',
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
//# sourceMappingURL=useStore.js.map