"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBarStepNumbers = void 0;
var _reactNative = require("react-native");
var _useStore = require("../../../stores/useStore.js");
var _jsxRuntime = require("react/jsx-runtime");
const ProgressBarStepNumbers = () => {
  const tourStepIndex = (0, _useStore.useStore)(s => s.tourStepIndex) + 1;
  const tourStepLength = (0, _useStore.useStore)(s => s.tourStepLength);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.container,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.text,
      children: tourStepIndex
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.divider,
      children: "/"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.text,
      children: tourStepLength
    })]
  });
};
exports.ProgressBarStepNumbers = ProgressBarStepNumbers;
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  divider: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 4
  }
});
//# sourceMappingURL=ProgressBarStepNumbers.js.map