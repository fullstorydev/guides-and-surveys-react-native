"use strict";

import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from "../../stores/useStore.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const USAction = ({
  action,
  onColse
}) => {
  const {
    styleType,
    type,
    value
  } = action;
  const theme = useStore(s => s.theme);
  const setTourStepIndex = useStore(s => s.setTourStepIndex);
  const tourStepIndex = useStore(s => s.tourStepIndex);
  const tourStepLength = useStore(s => s.tourStepLength);
  const onPress = useMemo(() => {
    switch (type) {
      case 'next':
        if (tourStepIndex < tourStepLength - 1) return () => setTourStepIndex(tourStepIndex + 1);else return onColse;
      case 'previous':
        return () => setTourStepIndex(tourStepIndex - 1);
      default:
        return onColse;
    }
  }, [onColse, setTourStepIndex, tourStepIndex, tourStepLength, type]);
  const btnStyles = useMemo(() => StyleSheet.create({
    footerBtn: {
      marginRight: 10,
      padding: 8,
      borderRadius: 6
    },
    primaryBtn: {
      backgroundColor: theme.primaryColor,
      color: '#fff',
      borderWidth: 0
    },
    secondaryBtn: {
      borderColor: theme.secondaryButtonColor,
      borderWidth: 1
    }
  }), [theme]);
  const textStyles = useMemo(() => StyleSheet.create({
    footerBtn: {
      fontWeight: '500',
      fontSize: theme.fontButtonSize
    },
    primaryBtn: {
      color: '#fff'
    },
    secondaryBtn: {
      color: theme.secondaryButtonColor
    }
  }), [theme]);
  const textStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return {
          ...textStyles.footerBtn,
          ...textStyles.primaryBtn
        };
      case 'Secondary':
        return {
          ...textStyles.footerBtn,
          ...textStyles.secondaryBtn
        };
      default:
        return {
          ...textStyles.footerBtn
        };
    }
  }, [styleType, textStyles.footerBtn, textStyles.primaryBtn, textStyles.secondaryBtn]);
  const btnStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return {
          ...btnStyles.footerBtn,
          ...btnStyles.primaryBtn
        };
      case 'Secondary':
        return {
          ...btnStyles.footerBtn,
          ...btnStyles.secondaryBtn
        };
      default:
        return {
          ...btnStyles.footerBtn
        };
    }
  }, [btnStyles.footerBtn, btnStyles.primaryBtn, btnStyles.secondaryBtn, styleType]);
  return /*#__PURE__*/_jsx(TouchableOpacity, {
    style: btnStyle,
    onPress: onPress,
    children: /*#__PURE__*/_jsx(Text, {
      style: textStyle,
      children: value
    })
  });
};
//# sourceMappingURL=Action.js.map