import { useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import type { Theme } from '../../types';
import { createActionStyles } from './createActionStyles';

type ActionProps = {
  value: string;
  styleType: 'Primary' | 'Secondary' | 'Custom';
  theme: Theme;
  onPress: () => void;
};

export const Action = ({ value, styleType, theme, onPress }: ActionProps) => {
  const styles = useMemo(() => createActionStyles(theme), [theme]);
  const isSecondary = styleType === 'Secondary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.buttonSecondary : styles.buttonPrimary,
        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          isSecondary ? styles.buttonTextSecondary : styles.buttonTextPrimary,
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
};
