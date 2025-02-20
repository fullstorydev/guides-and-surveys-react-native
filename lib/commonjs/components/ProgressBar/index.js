"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderProgressBar = void 0;
var _index = require("../ProgressBar/Horizontal/index.js");
var _index2 = require("../ProgressBar/Dots/index.js");
var _index3 = require("../ProgressBar/StepNumbers/index.js");
var _jsxRuntime = require("react/jsx-runtime");
const RenderProgressBar = ({
  progress
}) => {
  if (!progress.state) return null;
  switch (progress.type) {
    case 2:
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.ProgressBarDots, {});
    case 3:
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_index3.ProgressBarStepNumbers, {});
    case 1:
    default:
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.ProgressBarHorizontal, {});
  }
};
exports.RenderProgressBar = RenderProgressBar;
//# sourceMappingURL=index.js.map