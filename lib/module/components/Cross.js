"use strict";

import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from "../stores/useStore.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const CrossBtn = ({
  onColse
}) => {
  const theme = useStore(s => s.theme);
  const styles = useMemo(() => StyleSheet.create({
    crossBtn: {
      width: 20,
      height: 20,
      alignItems: 'flex-end'
    },
    crossBtnIcon: {
      fontSize: 16,
      color: theme.secondaryButtonColor
    }
  }), [theme]);
  return /*#__PURE__*/_jsx(TouchableOpacity, {
    style: styles.crossBtn,
    onPress: onColse,
    children: /*#__PURE__*/_jsx(Text, {
      style: styles.crossBtnIcon,
      children: "X"
    })
  });
};
//# sourceMappingURL=Cross.js.map