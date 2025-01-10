"use strict";

import { StyleSheet, Text, View } from 'react-native';
import { Body } from "../Body.js";
import { Action } from "../Action/index.js";
import { CrossBtn } from "../Cross.js";
import { useMemo } from 'react';
import { useStore } from "../../stores/useStore.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Modal = ({
  step,
  onColse
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
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      marginTop: 10
    },
    modalText: {
      textAlign: 'center',
      fontSize: theme.fontSize,
      color: theme.fontColor
    },
    modalBody: {
      paddingVertical: 8
    },
    crossBtn: {
      fontSize: 16,
      width: 20,
      height: 20,
      alignItems: 'flex-end'
    }
  }), [theme]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.modal,
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.modalHeader,
      children: [/*#__PURE__*/_jsx(Text, {
        style: styles.modalText,
        children: title
      }), /*#__PURE__*/_jsx(CrossBtn, {
        onColse: onColse
      })]
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
          onColse
        }, action.id);
      })
    })]
  });
};
//# sourceMappingURL=Modal.js.map