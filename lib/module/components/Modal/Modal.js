"use strict";

import { StyleSheet, View } from 'react-native';
import { Body } from "../Body.js";
import { Action } from "../Action/index.js";
import { useMemo } from 'react';
import { useStore } from "../../stores/useStore.js";
import { StepHeader } from "../StepHeader/StepHeader.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Modal = ({
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
    modal: {
      backgroundColor: theme.bgColor,
      marginTop: '50%',
      marginHorizontal: '5%',
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 8
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: 10
    },
    modalBody: {
      paddingVertical: 8
    }
  }), [theme]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.modal,
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title,
      onClose
    }), /*#__PURE__*/_jsx(View, {
      style: styles.modalBody,
      children: !!content && /*#__PURE__*/_jsx(Body, {
        content: content
      })
    }), /*#__PURE__*/_jsx(View, {
      style: styles.modalFooter,
      children: actions.map(action => {
        return /*#__PURE__*/_jsx(Action, {
          action,
          onClose
        }, action.id);
      })
    })]
  });
};
//# sourceMappingURL=Modal.js.map