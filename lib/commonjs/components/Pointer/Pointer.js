"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pointer = void 0;
var _reactNative = require("react-native");
var _Body = require("../Body.js");
var _index = require("../Action/index.js");
var _useStore = require("../../stores/useStore.js");
var _react = require("react");
var _jsxRuntime = require("react/jsx-runtime");
const Pointer = ({
  step,
  onColse,
  layoutMeasure
}) => {
  const {
    title,
    actions,
    content,
    element
  } = step;
  const pointerRef = (0, _react.useRef)(null);
  const [uiMode, SetUiMode] = (0, _react.useState)('Bottom');
  const [pointerTopMargin, setPointerMargin] = (0, _react.useState)(0);
  const refs = (0, _useStore.useStore)(s => s.elementRefs);
  const ref = refs[element];
  const [measure, setMeasure] = (0, _react.useState)();
  (0, _react.useEffect)(() => {
    if (ref && ref.current) {
      //@ts-ignore
      ref?.current.measure((x, y, width, height, pageX, pageY) => {
        if (![x, y, width, height, pageX, pageY].some(i => i === undefined)) {
          setMeasure({
            x,
            y,
            width,
            height,
            pageX,
            pageY
          });
        }
      });
    }
  }, [ref]);
  (0, _react.useEffect)(() => {
    if (measure && layoutMeasure) {
      if (measure.y > layoutMeasure.height / 2) {
        SetUiMode('Top');
      } else {
        SetUiMode('Bottom');
      }
    }
  }, [layoutMeasure, layoutMeasure?.height, measure, measure?.y]);
  (0, _react.useEffect)(() => {
    if (measure) {
      if (uiMode === 'Bottom') {
        setPointerMargin(measure.pageY + measure.height + 10);
      } else {
        pointerRef?.current?.measure((_x, _y, _width, height) => {
          setPointerMargin(measure.pageY - height - 10);
        });
      }
    }
  }, [measure, pointerRef, uiMode]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: measure && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          left: 0,
          width: measure.pageX,
          height: '100%'
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          left: measure.pageX,
          width: '100%',
          height: measure.pageY
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          top: measure.pageY + measure?.height,
          left: measure.pageX,
          width: '100%',
          height: '100%'
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          top: measure.pageY,
          left: measure.pageX + measure.width,
          width: '100%',
          height: measure.height
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: {
          ...styles.pointer,
          marginTop: pointerTopMargin
        },
        ref: pointerRef,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
          style: styles.pointerHeader,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.pointerText,
            children: title
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
            style: styles.crossBtn,
            onPress: onColse,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              children: "X"
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.pointerBody,
          children: !!content && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Body.Body, {
            content: content
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.pointerFooter,
          children: actions.map(action => {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.Action, {
              action,
              onColse
            }, action.id);
          })
        })]
      })]
    })
  });
};
exports.Pointer = Pointer;
const styles = _reactNative.StyleSheet.create({
  pointer: {
    backgroundColor: '#fff',
    marginHorizontal: '5%',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  pointerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  pointerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginTop: 10
  },
  pointerText: {
    textAlign: 'center'
  },
  pointerBody: {
    paddingVertical: 8
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end'
  },
  dimmer: {
    position: 'absolute',
    backgroundColor: '#000000cc'
  }
});
//# sourceMappingURL=Pointer.js.map