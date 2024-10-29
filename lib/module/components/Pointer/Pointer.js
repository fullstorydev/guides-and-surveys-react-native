"use strict";

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Body } from "../Body.js";
import { Action } from "../Action/index.js";
import { useStore } from "../../stores/useStore.js";
import { useEffect, useRef, useState } from 'react';
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
  const pointerRef = useRef(null);
  const [uiMode, SetUiMode] = useState('Bottom');
  const [pointerTopMargin, setPointerMargin] = useState(0);
  const refs = useStore(s => s.elementRefs);
  const ref = refs[element];
  const [measure, setMeasure] = useState();
  useEffect(() => {
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
  useEffect(() => {
    if (measure && layoutMeasure) {
      if (measure.y > layoutMeasure.height / 2) {
        SetUiMode('Top');
      } else {
        SetUiMode('Bottom');
      }
    }
  }, [layoutMeasure, layoutMeasure?.height, measure, measure?.y]);
  useEffect(() => {
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
  return /*#__PURE__*/_jsx(_Fragment, {
    children: measure && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          left: 0,
          width: measure.pageX,
          height: '100%'
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          left: measure.pageX,
          width: '100%',
          height: measure.pageY
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          top: measure.pageY + measure?.height,
          left: measure.pageX,
          width: '100%',
          height: '100%'
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          ...styles.dimmer,
          top: measure.pageY,
          left: measure.pageX + measure.width,
          width: '100%',
          height: measure.height
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
          }), /*#__PURE__*/_jsx(TouchableOpacity, {
            style: styles.crossBtn,
            onPress: onColse,
            children: /*#__PURE__*/_jsx(Text, {
              children: "X"
            })
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
const styles = StyleSheet.create({
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