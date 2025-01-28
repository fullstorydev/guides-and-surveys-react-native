import type { Measure, ProgressorData, Theme, Tour, UsetigulTag } from '../types';
import { type LayoutChangeEvent } from 'react-native';
interface StoreState {
    token: string | undefined;
    tags: UsetigulTag | undefined;
    setToken: (token: string, tags?: UsetigulTag) => void;
    tourStepIndex: number;
    setTourStepIndex: (tourStepIndex: number) => void;
    tourStepLength: number;
    tours: Tour[];
    setTours: (tours: Tour[]) => void;
    availableTour: Tour | undefined;
    setAvailableTour: (availableTour: Tour | undefined) => void;
    pointers: {
        [key: string]: Measure;
    };
    setPointer: (id: string, pointer: LayoutChangeEvent) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    progress: {
        state: boolean;
        type: number;
    };
    progressorData: ProgressorData | null;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StoreState>>;
export {};
//# sourceMappingURL=useStore.d.ts.map