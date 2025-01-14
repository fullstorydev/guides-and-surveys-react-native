"use strict";

import { StyleSheet, Text, View } from 'react-native';
import { CrossBtn } from "../Cross.js";
import { useMemo } from 'react';
import { useStore } from "../../stores/useStore.js";
import { ProgressBarHorizontal } from "../ProgressBar/Horizontal/index.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const StepHeader = ({
  title,
  onClose
}) => {
  const theme = useStore(s => s.theme);
  const progress = useStore(s => s.progress);
  const styles = useMemo(() => StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    text: {
      textAlign: 'center',
      fontSize: theme.fontSize,
      color: theme.fontColor
    }
  }), [theme]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.header,
      children: [/*#__PURE__*/_jsx(Text, {
        style: styles.text,
        children: title
      }), /*#__PURE__*/_jsx(CrossBtn, {
        onClose: onClose
      })]
    }), progress.state && /*#__PURE__*/_jsx(ProgressBarHorizontal, {})]
  });
};
//# sourceMappingURL=StepHeader.js.map