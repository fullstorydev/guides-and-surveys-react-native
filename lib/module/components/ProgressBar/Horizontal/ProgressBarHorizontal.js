"use strict";

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStore } from "../../../stores/useStore.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const ProgressBarHorizontal = () => {
  const theme = useStore(s => s.theme);
  const tourStepIndex = useStore(s => s.tourStepIndex) + 1;
  const tourStepLength = useStore(s => s.tourStepLength);
  const progressAmount = (tourStepIndex / tourStepLength * 100).toFixed(2) + '%';
  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginHorizontal: -10,
      marginTop: 5
    },
    progress: {
      height: 3,
      width: progressAmount,
      backgroundColor: theme.progressBarColor
    }
  }), [progressAmount, theme.progressBarColor]);
  return /*#__PURE__*/_jsx(View, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(View, {
      style: styles.progress
    })
  });
};
//# sourceMappingURL=ProgressBarHorizontal.js.map