"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPointer = void 0;
var _useStore = require("../stores/useStore.js");
const setPointer = (id, pointer) => {
  const setPointerStoreFunc = _useStore.useStore.getState().setPointer;
  setPointerStoreFunc(id, pointer);
};
exports.setPointer = setPointer;
//# sourceMappingURL=setPointer.js.map