"use strict";

import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from "../stores/useStore.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const CrossBtn = ({
  onClose
}) => {
  const progressorData = useStore(s => s.progressorData);
  const setProgressorData = useStore(s => s.setProgressorData);
  const availableTour = useStore(s => s.availableTour);
  const onPressClose = () => {
    const newPD = {
      ...progressorData
    };
    const tour = newPD.tours?.find(t => t.id.toString() === availableTour?.id.toString());
    if (tour) {
      tour.currentStep = 0;
      tour.state = 'closed';
    } else {
      newPD.tours.push({
        id: availableTour?.id ?? '',
        state: 'closed',
        name: availableTour?.name ?? '',
        currentStep: 0,
        updatedAt: ''
      });
    }
    setProgressorData(newPD);
    onClose();
  };
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
    onPress: onPressClose,
    children: /*#__PURE__*/_jsx(Text, {
      style: styles.crossBtnIcon,
      children: "X"
    })
  });
};
//# sourceMappingURL=Cross.js.map