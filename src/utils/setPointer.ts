import type { LayoutChangeEvent } from 'react-native';
import { useStore } from '../stores/useStore';

export const setPointer = (id: string, pointer: LayoutChangeEvent) => {
  const setPointerStoreFunc = useStore.getState().setPointer;
  setPointerStoreFunc(id, pointer);
};
