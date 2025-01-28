"use strict";

import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal } from "./components/Modal/index.js";
import { useStore } from "./stores/useStore.js";
import { Pointer } from "./components/Pointer/index.js";
import { Slideout } from "./components/Slideout/index.js";
import { useCurrentRouteName } from "./hooks/useCurrentRouteName.js";
import { useTargetting } from "./hooks/useTargetting.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export { setPointer } from "./utils/setPointer.js";
export const Usetiful = ({
  children,
  token,
  tags
}) => {
  const currentRouteName = useCurrentRouteName();
  const tourStepIndex = useStore(s => s.tourStepIndex);
  const setToken = useStore(s => s.setToken);
  const availableTour = useStore(s => s.availableTour);
  const [layoutMeasure, setLayoutMeasure] = useState();
  useEffect(() => {
    setToken(token, tags);
  }, [setToken, tags, token]);
  useTargetting();
  useEffect(() => {
    setSelfClosed(false);
  }, [currentRouteName]);
  const [selfClosed, setSelfClosed] = useState(false);
  const step = !!availableTour && !selfClosed && availableTour.steps[tourStepIndex] ? availableTour.steps[tourStepIndex] : undefined;
  const refs = useStore(s => s.pointers);
  const stepType = useMemo(() => {
    if (step && step.type !== 'pointer') return step.type;else if (step?.type === 'pointer') return refs[step.element] ? 'pointer' : 'slideout';else return undefined;
  }, [refs, step]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.UsetifulContainer,
    onLayout: e => {
      e.target.measure((x, y, width, height, pageX, pageY) => {
        if (![x, y, width, height, pageX, pageY].some(i => i === undefined)) {
          setLayoutMeasure({
            x,
            y,
            width,
            height,
            pageX,
            pageY
          });
        }
      });
    },
    children: [children, step && /*#__PURE__*/_jsxs(View
    // eslint-disable-next-line react-native/no-inline-styles
    , {
      style: {
        ...styles.usetifulLayer,
        backgroundColor: stepType === 'modal' ? '#000000cc' : 'transparent',
        justifyContent: stepType === 'slideout' ? 'flex-end' : 'flex-start'
      },
      children: [stepType === 'modal' && /*#__PURE__*/_jsx(Modal, {
        step: step,
        onClose: () => setSelfClosed(true)
      }), stepType === 'pointer' && /*#__PURE__*/_jsx(Pointer, {
        step: step,
        onClose: () => setSelfClosed(true),
        layoutMeasure: layoutMeasure
      }), stepType === 'slideout' && /*#__PURE__*/_jsx(Slideout, {
        step: step,
        onClose: () => setSelfClosed(true)
      })]
    })]
  });
};
const styles = StyleSheet.create({
  UsetifulContainer: {
    flex: 1
  },
  usetifulLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc'
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end'
  },
  footerBtn: {
    marginRight: 10,
    padding: 8,
    borderRadius: 6
  },
  primaryBtn: {
    backgroundColor: '#387DFF'
  },
  secondaryBrn: {
    borderColor: '#464646',
    borderWidth: 1
  }
});
//# sourceMappingURL=index.js.map