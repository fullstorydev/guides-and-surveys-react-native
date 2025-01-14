"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USAction = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _useStore = require("../../stores/useStore.js");
var _jsxRuntime = require("react/jsx-runtime");
const USAction = ({
  action,
  onClose
}) => {
  const {
    styleType,
    type,
    value
  } = action;
  const theme = (0, _useStore.useStore)(s => s.theme);
  const setTourStepIndex = (0, _useStore.useStore)(s => s.setTourStepIndex);
  const tourStepIndex = (0, _useStore.useStore)(s => s.tourStepIndex);
  const tourStepLength = (0, _useStore.useStore)(s => s.tourStepLength);
  const onPress = (0, _react.useMemo)(() => {
    switch (type) {
      case 'next':
        if (tourStepIndex < tourStepLength - 1) return () => setTourStepIndex(tourStepIndex + 1);else return onClose;
      case 'previous':
        return () => setTourStepIndex(tourStepIndex - 1);
      default:
        return onClose;
    }
  }, [onClose, setTourStepIndex, tourStepIndex, tourStepLength, type]);
  const btnStyles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    footerBtn: {
      marginRight: 10,
      padding: 8,
      borderRadius: 6
    },
    primaryBtn: {
      backgroundColor: theme.primaryColor,
      color: '#fff',
      borderWidth: 0
    },
    secondaryBtn: {
      borderColor: theme.secondaryButtonColor,
      borderWidth: 1
    }
  }), [theme]);
  const textStyles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    footerBtn: {
      fontWeight: '500',
      fontSize: theme.fontButtonSize
    },
    primaryBtn: {
      color: '#fff'
    },
    secondaryBtn: {
      color: theme.secondaryButtonColor
    }
  }), [theme]);
  const textStyle = (0, _react.useMemo)(() => {
    switch (styleType) {
      case 'Primary':
        return {
          ...textStyles.footerBtn,
          ...textStyles.primaryBtn
        };
      case 'Secondary':
        return {
          ...textStyles.footerBtn,
          ...textStyles.secondaryBtn
        };
      default:
        return {
          ...textStyles.footerBtn
        };
    }
  }, [styleType, textStyles.footerBtn, textStyles.primaryBtn, textStyles.secondaryBtn]);
  const btnStyle = (0, _react.useMemo)(() => {
    switch (styleType) {
      case 'Primary':
        return {
          ...btnStyles.footerBtn,
          ...btnStyles.primaryBtn
        };
      case 'Secondary':
        return {
          ...btnStyles.footerBtn,
          ...btnStyles.secondaryBtn
        };
      default:
        return {
          ...btnStyles.footerBtn
        };
    }
  }, [btnStyles.footerBtn, btnStyles.primaryBtn, btnStyles.secondaryBtn, styleType]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
    style: btnStyle,
    onPress: onPress,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: textStyle,
      children: value
    })
  });
};
exports.USAction = USAction;
//# sourceMappingURL=Action.js.map