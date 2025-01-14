"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StepHeader = void 0;
var _reactNative = require("react-native");
var _Cross = require("../Cross.js");
var _react = require("react");
var _useStore = require("../../stores/useStore.js");
var _index = require("../ProgressBar/Horizontal/index.js");
var _jsxRuntime = require("react/jsx-runtime");
const StepHeader = ({
  title,
  onClose
}) => {
  const theme = (0, _useStore.useStore)(s => s.theme);
  const progress = (0, _useStore.useStore)(s => s.progress);
  const styles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    text: {
      textAlign: 'center',
      fontSize: theme.fontSize,
      color: theme.fontColor
    }
  }), [theme]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.header,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.text,
        children: title
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Cross.CrossBtn, {
        onClose: onClose
      })]
    }), progress.state && /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.ProgressBarHorizontal, {})]
  });
};
exports.StepHeader = StepHeader;
//# sourceMappingURL=StepHeader.js.map