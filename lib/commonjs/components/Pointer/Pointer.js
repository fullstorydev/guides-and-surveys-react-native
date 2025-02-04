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
var _StepHeader = require("../StepHeader/StepHeader.js");
var _jsxRuntime = require("react/jsx-runtime");
const Pointer = ({
  step,
  onClose,
  layoutMeasure
}) => {
  const {
    title,
    actions,
    content,
    element
  } = step;
  const theme = (0, _useStore.useStore)(s => s.theme);
  const pointerRef = (0, _react.useRef)(null);
  const [uiMode, SetUiMode] = (0, _react.useState)('Bottom');
  const [pointerTopMargin, setPointerMargin] = (0, _react.useState)(0);
  const refs = (0, _useStore.useStore)(s => s.pointers);
  const ref = refs[element];
  console.log('====top=======>', ref, layoutMeasure?.height);
  (0, _react.useEffect)(() => {
    if (ref && layoutMeasure) {
      if (ref.y > layoutMeasure.height / 2) {
        SetUiMode('Top');
      } else {
        SetUiMode('Bottom');
      }
    }
  }, [layoutMeasure, layoutMeasure?.height, ref]);
  (0, _react.useEffect)(() => {
    if (ref) {
      if (uiMode === 'Bottom') {
        setPointerMargin(ref.pageY + ref.height + 10);
      } else {
        pointerRef?.current?.measure((_x, _y, _width, height) => {
          setPointerMargin(ref.pageY - height - 10);
        });
      }
    }
  }, [pointerRef, ref, uiMode]);
  const styles = (0, _react.useMemo)(() => {
    const MARGIN_HORIZONTAL = 15;
    const PADDING_HIRIZONTAL = 10;
    const centerOfElementOnScreen = (ref?.pageX ?? 0) - (PADDING_HIRIZONTAL + MARGIN_HORIZONTAL) + (ref?.width ?? 0) / 2;
    return _reactNative.StyleSheet.create({
      pointer: {
        backgroundColor: theme.bgColor,
        marginHorizontal: MARGIN_HORIZONTAL,
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        borderRadius: 5,
        paddingHorizontal: PADDING_HIRIZONTAL,
        paddingVertical: 8
      },
      pointerFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        marginTop: 10
      },
      pointerText: {
        textAlign: 'center',
        fontSize: theme.fontSize,
        color: theme.fontColor
      },
      pointerBody: {
        paddingVertical: 8
      },
      tip: {
        width: 10,
        height: 10,
        position: 'absolute',
        ...(uiMode === 'Bottom' ? {
          top: -5
        } : {
          bottom: -5
        }),
        left: centerOfElementOnScreen,
        backgroundColor: theme.bgColor,
        transform: 'rotate(45deg)'
      },
      dimmer: {
        position: 'absolute',
        backgroundColor: '#000000cc'
      },
      dimmer1: {
        left: 0,
        width: ref?.pageX,
        height: '100%'
      },
      dimmer2: {
        left: ref?.pageX,
        width: '100%',
        height: ref?.pageY
      },
      dimmer3: {
        top: (ref?.pageY ?? 0) + (ref?.height ?? 0),
        left: ref?.pageX,
        width: '100%',
        height: '100%'
      },
      dimmer4: {
        top: ref?.pageY,
        left: (ref?.pageX ?? 0) + (ref?.width ?? 0),
        width: '100%',
        height: ref?.height
      }
    });
  }, [ref, theme, uiMode]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: ref && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          ...styles.dimmer1
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          ...styles.dimmer2
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          ...styles.dimmer3
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          ...styles.dimmer4
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: {
          ...styles.pointer,
          marginTop: pointerTopMargin
        },
        ref: pointerRef,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.tip
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_StepHeader.StepHeader, {
          title,
          onClose
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
              onClose
            }, action.id);
          })
        })]
      })]
    })
  });
};
exports.Pointer = Pointer;
//# sourceMappingURL=Pointer.js.map