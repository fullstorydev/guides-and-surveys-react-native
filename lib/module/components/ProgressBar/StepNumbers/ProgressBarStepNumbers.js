"use strict";

import { View, Text, StyleSheet } from 'react-native';
import { useStore } from "../../../stores/useStore.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ProgressBarStepNumbers = () => {
  const tourStepIndex = useStore(s => s.tourStepIndex) + 1;
  const tourStepLength = useStore(s => s.tourStepLength);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [/*#__PURE__*/_jsx(Text, {
      style: styles.text,
      children: tourStepIndex
    }), /*#__PURE__*/_jsx(Text, {
      style: styles.divider,
      children: "/"
    }), /*#__PURE__*/_jsx(Text, {
      style: styles.text,
      children: tourStepLength
    })]
  });
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  divider: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 4
  }
});
//# sourceMappingURL=ProgressBarStepNumbers.js.map