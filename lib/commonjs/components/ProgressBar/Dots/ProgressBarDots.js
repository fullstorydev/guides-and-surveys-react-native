"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBarDots = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _useStore = require("../../../stores/useStore.js");
var _jsxRuntime = require("react/jsx-runtime");
const ProgressBarDots = () => {
  const theme = (0, _useStore.useStore)(s => s.theme);
  const tourStepIndex = (0, _useStore.useStore)(s => s.tourStepIndex);
  const tourStepLength = (0, _useStore.useStore)(s => s.tourStepLength);
  const dots = (0, _react.useMemo)(() => Array.from({
    length: tourStepLength
  }).map((_, i) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [styles.dot, {
      backgroundColor: i === tourStepIndex ? theme.progressBarColor : theme.fontColor
    }]
  }, i)), [tourStepIndex, tourStepLength, theme.progressBarColor, theme.fontColor]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: styles.container,
    children: dots
  });
};
exports.ProgressBarDots = ProgressBarDots;
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4
  }
});
//# sourceMappingURL=ProgressBarDots.js.map