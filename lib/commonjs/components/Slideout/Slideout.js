"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slideout = void 0;
var _reactNative = require("react-native");
var _Body = require("../Body.js");
var _index = require("../Action/index.js");
var _useStore = require("../../stores/useStore.js");
var _react = require("react");
var _StepHeader = require("../StepHeader/StepHeader.js");
var _jsxRuntime = require("react/jsx-runtime");
const Slideout = ({
  step,
  onClose
}) => {
  const {
    title,
    actions,
    content
  } = step;
  const theme = (0, _useStore.useStore)(s => s.theme);
  const styles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    slidout: {
      backgroundColor: theme.bgColor,
      marginHorizontal: '5%',
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 30
    },
    slidoutFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      marginTop: 10
    },
    slidoutBody: {
      paddingVertical: 8
    }
  }), [theme]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.slidout,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_StepHeader.StepHeader, {
      title,
      onClose
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.slidoutBody,
      children: !!content && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Body.Body, {
        content: content
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.slidoutFooter,
      children: actions.map(action => {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.Action, {
          action,
          onClose
        }, action.id);
      })
    })]
  });
};
exports.Slideout = Slideout;
//# sourceMappingURL=Slideout.js.map