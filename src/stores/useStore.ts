import { create } from 'zustand';
import type { Measure, Theme, Tour } from '../types';
import { type LayoutChangeEvent } from 'react-native';

interface StoreState {
  tourStepIndex: number;
  setTourStepIndex: (tourStepIndex: number) => void;
  tourStepLength: number;
  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  availableTour: Tour | undefined;
  setAvailableTour: (availableTour: Tour | undefined) => void;
  pointers: { [key: string]: Measure };
  setPointer: (id: string, pointer: LayoutChangeEvent) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
export const useStore = create<StoreState>((set) => ({
  pointers: {},
  tourStepLength: 0,
  setPointer: (id: string, pointer: LayoutChangeEvent) => {
    pointer.target.measure((x, y, width, height, pageX, pageY) => {
      if (![x, y, width, height, pageX, pageY].some((i) => i === undefined)) {
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
    set((state) => {
      if (
        state.availableTour &&
        state.availableTour.steps.length - 1 >= tourStepIndex &&
        tourStepIndex >= 0
      ) {
        return { ...state, tourStepIndex };
      } else {
        return { ...state };
      }
    });
  },
  tours: [],
  setTours: (tours) => set({ tours }),
  availableTour: undefined,
  setAvailableTour: (availableTour) => {
    let theme = THEME_DEFAULT;
    if (availableTour?.themeObject) {
      theme = availableTour?.themeObject;
    }
    return set({
      availableTour,
      theme,
      tourStepLength: availableTour?.steps?.length ?? 0,
    });
  },
  theme: THEME_DEFAULT,
  setTheme: (theme) => set({ theme }),
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
  fontButtonSize: 14,
};
