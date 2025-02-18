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
    setAvailableTour: (availableTour: Tour | undefined, tourStepIndex?: number) => void;
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
    progressorHasChanged: boolean;
    setProgressorHasChanged: (progressorHasChanged: boolean) => void;
    progressorData: ProgressorData;
    setProgressorData: (progressorData: ProgressorData) => void;
    gotoTour: (tourId: string) => void;
}
type StorePersistedState = Pick<StoreState, 'progressorData'>;
export declare const useStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<StoreState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<StoreState, StorePersistedState>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: StoreState) => void) => () => void;
        onFinishHydration: (fn: (state: StoreState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<StoreState, StorePersistedState>>;
    };
}>;
export {};
//# sourceMappingURL=useStore.d.ts.map