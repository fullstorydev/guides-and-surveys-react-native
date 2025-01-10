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
var _Cross = require("../Cross.js");
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
  const theme = (0, _useStore.useStore)(s => s.theme);
  const pointerRef = (0, _react.useRef)(null);
  const [uiMode, SetUiMode] = (0, _react.useState)('Bottom');
  const [pointerTopMargin, setPointerMargin] = (0, _react.useState)(0);
  const refs = (0, _useStore.useStore)(s => s.pointers);
  const ref = refs[element];
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
  const styles = (0, _react.useMemo)(() => _reactNative.StyleSheet.create({
    pointer: {
      backgroundColor: theme.bgColor,
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
      textAlign: 'center',
      fontSize: theme.fontSize,
      color: theme.fontColor
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
  }), [theme]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: ref && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          left: 0,
          width: ref.pageX,
          height: '100%'
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          left: ref.pageX,
          width: '100%',
          height: ref?.pageY
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          top: ref.pageY + ref.height,
          left: ref?.pageX,
          width: '100%',
          height: '100%'
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          ...styles.dimmer,
          top: ref.pageY,
          left: ref.pageX + ref.width,
          width: '100%',
          height: ref?.height
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
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Cross.CrossBtn, {
            onColse: onColse
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
//# sourceMappingURL=Pointer.js.map