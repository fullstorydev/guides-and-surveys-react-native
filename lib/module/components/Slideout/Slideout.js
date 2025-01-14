"use strict";

import { StyleSheet, View } from 'react-native';
import { Body } from "../Body.js";
import { Action } from "../Action/index.js";
import { useStore } from "../../stores/useStore.js";
import { useMemo } from 'react';
import { StepHeader } from "../StepHeader/StepHeader.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Slideout = ({
  step,
  onClose
}) => {
  const {
    title,
    actions,
    content
  } = step;
  const theme = useStore(s => s.theme);
  const styles = useMemo(() => StyleSheet.create({
    slidout: {
      backgroundColor: theme.bgColor,
      marginHorizontal: '5%',
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 30
    },
    slidoutFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      marginTop: 10
    },
    slidoutBody: {
      paddingVertical: 8
    }
  }), [theme]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.slidout,
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title,
      onClose
    }), /*#__PURE__*/_jsx(View, {
      style: styles.slidoutBody,
      children: !!content && /*#__PURE__*/_jsx(Body, {
        content: content
      })
    }), /*#__PURE__*/_jsx(View, {
      style: styles.slidoutFooter,
      children: actions.map(action => {
        return /*#__PURE__*/_jsx(Action, {
          action,
          onClose
        }, action.id);
      })
    })]
  });
};
//# sourceMappingURL=Slideout.js.map