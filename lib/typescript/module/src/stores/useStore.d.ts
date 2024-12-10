import type { Measure, Tour } from '../types';
import { type LayoutChangeEvent } from 'react-native';
interface StoreState {
    tourStepIndex: number;
    setTourStepIndex: (tourStepIndex: number) => void;
    tours: Tour[];
    setTours: (tours: Tour[]) => void;
    availableTour: Tour | undefined;
    setAvailableTour: (availableTour: Tour | undefined) => void;
    pointers: {
        [key: string]: Measure;
    };
    setPointer: (id: string, pointer: LayoutChangeEvent) => void;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StoreState>>;
export {};
//# sourceMappingURL=useStore.d.ts.map