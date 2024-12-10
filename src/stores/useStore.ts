import { create } from 'zustand';
import type { Measure, Tour } from '../types';
import { type LayoutChangeEvent } from 'react-native';

interface StoreState {
  tourStepIndex: number;
  setTourStepIndex: (tourStepIndex: number) => void;
  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  availableTour: Tour | undefined;
  setAvailableTour: (availableTour: Tour | undefined) => void;
  pointers: { [key: string]: Measure };
  setPointer: (id: string, pointer: LayoutChangeEvent) => void;
}
export const useStore = create<StoreState>((set) => ({
  pointers: {},
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
  setAvailableTour: (availableTour) => set({ availableTour }),
}));
