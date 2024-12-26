import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { ActionType } from '../../types';
import { useStore } from '../../stores/useStore';

type ActionProps = {
  action: ActionType;
  onColse: () => void;
};
export const USAction = ({ action, onColse }: ActionProps) => {
  const { styleType, type, value } = action;

  const setTourStepIndex = useStore((s) => s.setTourStepIndex);
  const tourStepIndex = useStore((s) => s.tourStepIndex);

  const onPress = useMemo(() => {
    switch (type) {
      case 'next':
        return () => setTourStepIndex(tourStepIndex + 1);
      case 'previous':
        return () => setTourStepIndex(tourStepIndex - 1);
      default:
        return onColse;
    }
  }, [onColse, setTourStepIndex, tourStepIndex, type]);

  const btnStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return { ...btnStyles.footerBtn, ...btnStyles.primaryBtn };
      case 'Secondary':
        return { ...btnStyles.footerBtn, ...btnStyles.secondaryBtn };
      default:
        return { ...btnStyles.footerBtn };
    }
  }, [styleType]);

  const textStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return { ...textStyles.footerBtn, ...textStyles.primaryBtn };
      case 'Secondary':
        return { ...textStyles.footerBtn, ...textStyles.secondaryBtn };
      default:
        return { ...textStyles.footerBtn };
    }
  }, [styleType]);

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress}>
      <Text style={textStyle}>{value}</Text>
    </TouchableOpacity>
  );
};

const btnStyles = StyleSheet.create({
  footerBtn: {
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
  primaryBtn: {
    backgroundColor: '#387DFF',
    color: '#fff',
    borderWidth: 0,
  },
  secondaryBtn: {
    borderColor: '#ddd',
    borderWidth: 1,
  },
});

const textStyles = StyleSheet.create({
  footerBtn: {
    fontWeight: '500',
  },
  primaryBtn: {
    color: '#fff',
  },
  secondaryBtn: {
    color: '#212121',
  },
});
