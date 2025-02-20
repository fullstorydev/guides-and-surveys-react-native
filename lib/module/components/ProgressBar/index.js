"use strict";

import { ProgressBarHorizontal } from "../ProgressBar/Horizontal/index.js";
import { ProgressBarDots } from "../ProgressBar/Dots/index.js";
import { ProgressBarStepNumbers } from "../ProgressBar/StepNumbers/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const RenderProgressBar = ({
  progress
}) => {
  if (!progress.state) return null;
  switch (progress.type) {
    case 2:
      return /*#__PURE__*/_jsx(ProgressBarDots, {});
    case 3:
      return /*#__PURE__*/_jsx(ProgressBarStepNumbers, {});
    case 1:
    default:
      return /*#__PURE__*/_jsx(ProgressBarHorizontal, {});
  }
};
//# sourceMappingURL=index.js.map