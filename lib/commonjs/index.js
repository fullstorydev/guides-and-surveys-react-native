"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Usetiful = void 0;
Object.defineProperty(exports, "useRefRegister", {
  enumerable: true,
  get: function () {
    return _useRefRegister.useRefRegister;
  }
});
var _react = require("react");
var _reactNative = require("react-native");
var _native = require("@react-navigation/native");
var _index = require("./components/Modal/index.js");
var _useStore = require("./stores/useStore.js");
var _index2 = require("./components/Pointer/index.js");
var _index3 = require("./components/Slideout/index.js");
var _jsxRuntime = require("react/jsx-runtime");
var _useRefRegister = require("./hooks/useRefRegister.js");
const useCurrentRouteName = () => {
  const [currentRouteName, setCurrentRouteName] = (0, _react.useState)('');
  const state = (0, _native.useNavigationState)(s => s);
  (0, _react.useEffect)(() => {
    if (state) {
      let route = state.routes[state.index];
      const pathResult = [];
      if (route) {
        pathResult.push(route.name);
        let subState = route.state;
        while (subState) {
          route = subState.routes[subState.index ?? 0];
          if (route) {
            pathResult.push(route.name);
            subState = route.state;
          } else {
            subState = undefined;
          }
        }
      }
      setCurrentRouteName(pathResult.join('/'));
    }
  }, [state]);
  return currentRouteName;
};
const Usetiful = ({
  children,
  token
}) => {
  const currentRouteName = useCurrentRouteName();
  const layoutRef = (0, _react.useRef)(null);
  const tours = (0, _useStore.useStore)(s => s.tours);
  const setTours = (0, _useStore.useStore)(s => s.setTours);
  const setTourStepIndex = (0, _useStore.useStore)(s => s.setTourStepIndex);
  const tourStepIndex = (0, _useStore.useStore)(s => s.tourStepIndex);
  const availableTour = (0, _useStore.useStore)(s => s.availableTour);
  const setAvailableTour = (0, _useStore.useStore)(s => s.setAvailableTour);
  const [layoutMeasure, setLayoutMeasure] = (0, _react.useState)();
  (0, _react.useEffect)(() => {
    const fetchData = () => {
      fetch('https://www.usetiful.com/api-space/data.json?lang=en', {
        method: 'GET',
        headers: {
          'X-Auth-Token': '34ae1d22e7615d614bd3a17920a907c0',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        response.json().then(res => {
          setTours(res.tours);
          console.log(`
              =============================================
              =============================================
              ============== USETIFUL =====================
              ================= IS ========================
              ============== LOADED =======================
              =============================================
              =============================================`);
        });
      }).catch(error => {
        console.log('=====error====>', error.message);
      });
    };
    if (fetchData) fetchData();
  }, [setTours, token]);
  (0, _react.useEffect)(() => {
    setTourStepIndex(0);
    if (tours && tours.length) {
      setAvailableTour(tours.find(tour => {
        if (tour.targets) {
          return tour.targets.find(target => !!target.url && currentRouteName.includes(target.url));
        }
        return undefined;
      }));
    } else {
      setAvailableTour(undefined);
    }
  }, [currentRouteName, setAvailableTour, setTourStepIndex, tours]);
  (0, _react.useEffect)(() => {
    setSelfClosed(false);
  }, [currentRouteName]);
  const [selfClosed, setSelfClosed] = (0, _react.useState)(false);
  const step = !!availableTour && !selfClosed && availableTour.steps[tourStepIndex] ? availableTour.steps[tourStepIndex] : undefined;
  const refs = (0, _useStore.useStore)(s => s.elementRefs);
  const stepType = (0, _react.useMemo)(() => {
    if (step && step.type !== 'pointer') return step.type;else if (step?.type === 'pointer') return refs[step.element] ? 'pointer' : 'slideout';else return undefined;
  }, [refs, step]);
  (0, _react.useEffect)(() => {
    if (layoutRef && layoutRef.current) {
      //@ts-ignore
      layoutRef?.current.measure((x, y, width, height, pageX, pageY) => {
        setLayoutMeasure({
          x,
          y,
          width,
          height,
          pageX,
          pageY
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutRef.current]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.UsetifulContainer,
    ref: layoutRef,
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
        onColse: () => setSelfClosed(true)
      }), stepType === 'pointer' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.Pointer, {
        step: step,
        onColse: () => setSelfClosed(true),
        layoutMeasure: layoutMeasure
      }), stepType === 'slideout' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_index3.Slideout, {
        step: step,
        onColse: () => setSelfClosed(true)
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