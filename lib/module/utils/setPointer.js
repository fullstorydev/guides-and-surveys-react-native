"use strict";

import { useStore } from "../stores/useStore.js";
export const setPointer = (id, pointer) => {
  const setPointerStoreFunc = useStore.getState().setPointer;
  setPointerStoreFunc(id, pointer);
};
//# sourceMappingURL=setPointer.js.map