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
  const progressorData = (0, _useStore.useStore)(s => s.progressorData);
  const setProgressorData = (0, _useStore.useStore)(s => s.setProgressorData);
  const availableTour = (0, _useStore.useStore)(s => s.availableTour);
  const onPressClose = () => {
    const newPD = {
      ...progressorData
    };
    const tour = newPD.tours?.find(t => t.id.toString() === availableTour?.id.toString());
    if (tour) {
      tour.currentStep = 0;
      tour.state = 'closed';
    } else {
      newPD.tours.push({
        id: availableTour?.id ?? '',
        state: 'closed',
        name: availableTour?.name ?? '',
        currentStep: 0,
        updatedAt: ''
      });
    }
    setProgressorData(newPD);
    onClose();
  };
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
    onPress: onPressClose,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.crossBtnIcon,
      children: "X"
    })
  });
};
exports.CrossBtn = CrossBtn;
//# sourceMappingURL=Cross.js.map