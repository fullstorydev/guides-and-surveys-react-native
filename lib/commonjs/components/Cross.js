"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrossBtn = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _useStore = require("../stores/useStore.js");
var _jsxRuntime = require("react/jsx-runtime");
const CrossBtn = ({
  onClose
}) => {
  const theme = (0, _useStore.useStore)(s => s.theme);
  const styles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    crossBtn: {
      width: 20,
      height: 20,
      alignItems: 'flex-end'
    },
    crossBtnIcon: {
      fontSize: 16,
      color: theme.secondaryButtonColor
    }
  }), [theme]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
    style: styles.crossBtn,
    onPress: onClose,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.crossBtnIcon,
      children: "X"
    })
  });
};
exports.CrossBtn = CrossBtn;
//# sourceMappingURL=Cross.js.map