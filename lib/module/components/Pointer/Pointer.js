"use strict";

import { StyleSheet, Text, View } from 'react-native';
import { Body } from "../Body.js";
import { Action } from "../Action/index.js";
import { useStore } from "../../stores/useStore.js";
import { useEffect, useMemo, useRef, useState } from 'react';
import { CrossBtn } from "../Cross.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const Pointer = ({
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
  const theme = useStore(s => s.theme);
  const pointerRef = useRef(null);
  const [uiMode, SetUiMode] = useState('Bottom');
  const [pointerTopMargin, setPointerMargin] = useState(0);
  const refs = useStore(s => s.pointers);
  const ref = refs[element];
  useEffect(() => {
    if (ref && layoutMeasure) {
      if (ref.y > layoutMeasure.height / 2) {
        SetUiMode('Top');
      } else {
        SetUiMode('Bottom');
      }
    }
  }, [layoutMeasure, layoutMeasure?.height, ref]);
  useEffect(() => {
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
  const styles = useMemo(() => StyleSheet.create({
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
  return /*#__PURE__*/_jsx(_Fragment, {
    children: ref && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          left: 0,
          width: ref.pageX,
          height: '100%'
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          left: ref.pageX,
          width: '100%',
          height: ref?.pageY
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          top: ref.pageY + ref.height,
          left: ref?.pageX,
          width: '100%',
          height: '100%'
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          top: ref.pageY,
          left: ref.pageX + ref.width,
          width: '100%',
          height: ref?.height
        }
      }), /*#__PURE__*/_jsxs(View, {
        style: {
          ...styles.pointer,
          marginTop: pointerTopMargin
        },
        ref: pointerRef,
        children: [/*#__PURE__*/_jsxs(View, {
          style: styles.pointerHeader,
          children: [/*#__PURE__*/_jsx(Text, {
            style: styles.pointerText,
            children: title
          }), /*#__PURE__*/_jsx(CrossBtn, {
            onColse: onColse
          })]
        }), /*#__PURE__*/_jsx(View, {
          style: styles.pointerBody,
          children: !!content && /*#__PURE__*/_jsx(Body, {
            content: content
          })
        }), /*#__PURE__*/_jsx(View, {
          style: styles.pointerFooter,
          children: actions.map(action => {
            return /*#__PURE__*/_jsx(Action, {
              action,
              onColse
            }, action.id);
          })
        })]
      })]
    })
  });
};
//# sourceMappingURL=Pointer.js.map