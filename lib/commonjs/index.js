"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Usetiful = void 0;
Object.defineProperty(exports, "setPointer", {
  enumerable: true,
  get: function () {
    return _setPointer.setPointer;
  }
});
var _react = require("react");
var _reactNative = require("react-native");
var _index = require("./components/Modal/index.js");
var _useStore = require("./stores/useStore.js");
var _index2 = require("./components/Pointer/index.js");
var _index3 = require("./components/Slideout/index.js");
var _useCurrentRouteName = require("./hooks/useCurrentRouteName.js");
var _useTargetting = require("./hooks/useTargetting.js");
var _jsxRuntime = require("react/jsx-runtime");
var _setPointer = require("./utils/setPointer.js");
const Usetiful = ({
  children,
  token,
  tags
}) => {
  const currentRouteName = (0, _useCurrentRouteName.useCurrentRouteName)();
  const tourStepIndex = (0, _useStore.useStore)(s => s.tourStepIndex);
  const setToken = (0, _useStore.useStore)(s => s.setToken);
  const availableTour = (0, _useStore.useStore)(s => s.availableTour);
  const [layoutMeasure, setLayoutMeasure] = (0, _react.useState)();
  (0, _react.useEffect)(() => {
    setToken(token, tags);
  }, [setToken, tags, token]);
  (0, _useTargetting.useTargetting)();
  (0, _react.useEffect)(() => {
    setSelfClosed(false);
  }, [currentRouteName]);
  const [selfClosed, setSelfClosed] = (0, _react.useState)(false);
  const step = !!availableTour && !selfClosed && availableTour.steps[tourStepIndex] ? availableTour.steps[tourStepIndex] : undefined;
  const refs = (0, _useStore.useStore)(s => s.pointers);
  const stepType = (0, _react.useMemo)(() => {
    if (step && step.type !== 'pointer') return step.type;else if (step?.type === 'pointer') return refs[step.element] ? 'pointer' : 'slideout';else return undefined;
  }, [refs, step]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.UsetifulContainer,
    onLayout: e => {
      e.target.measure((x, y, width, height, pageX, pageY) => {
        if (![x, y, width, height, pageX, pageY].some(i => i === undefined)) {
          setLayoutMeasure({
            x,
            y,
            width,
            height,
            pageX,
            pageY
          });
        }
      });
    },
    children: [children, step && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View
    // eslint-disable-next-line react-native/no-inline-styles
    , {
      style: {
        ...styles.usetifulLayer,
        backgroundColor: stepType === 'modal' ? '#000000cc' : 'transparent',
        justifyContent: stepType === 'slideout' ? 'flex-end' : 'flex-start'
      },
      children: [stepType === 'modal' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.Modal, {
        step: step,
        onClose: () => setSelfClosed(true)
      }), stepType === 'pointer' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.Pointer, {
        step: step,
        onClose: () => setSelfClosed(true),
        layoutMeasure: layoutMeasure
      }), stepType === 'slideout' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_index3.Slideout, {
        step: step,
        onClose: () => setSelfClosed(true)
      })]
    })]
  });
};
exports.Usetiful = Usetiful;
const styles = _reactNative.StyleSheet.create({
  UsetifulContainer: {
    flex: 1
  },
  usetifulLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc'
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end'
  },
  footerBtn: {
    marginRight: 10,
    padding: 8,
    borderRadius: 6
  },
  primaryBtn: {
    backgroundColor: '#387DFF'
  },
  secondaryBrn: {
    borderColor: '#464646',
    borderWidth: 1
  }
});
//# sourceMappingURL=index.js.map