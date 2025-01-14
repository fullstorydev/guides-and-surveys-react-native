"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBarHorizontal = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _useStore = require("../../../stores/useStore.js");
var _jsxRuntime = require("react/jsx-runtime");
const ProgressBarHorizontal = () => {
  const theme = (0, _useStore.useStore)(s => s.theme);
  const tourStepIndex = (0, _useStore.useStore)(s => s.tourStepIndex) + 1;
  const tourStepLength = (0, _useStore.useStore)(s => s.tourStepLength);
  const progressAmount = (tourStepIndex / tourStepLength * 100).toFixed(2) + '%';
  const styles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    container: {
      marginHorizontal: -10,
      marginTop: 5
    },
    progress: {
      height: 3,
      width: progressAmount,
      backgroundColor: theme.progressBarColor
    }
  }), [progressAmount, theme.progressBarColor]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: styles.container,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.progress
    })
  });
};
exports.ProgressBarHorizontal = ProgressBarHorizontal;
//# sourceMappingURL=ProgressBarHorizontal.js.map