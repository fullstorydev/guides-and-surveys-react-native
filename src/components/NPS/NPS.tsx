import { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { Theme } from '../../types';
import { createNPSStyles, NPS_SCALE_LENGTH } from './createNPSStyles';

type NPSProps = {
  leftLabel?: string;
  rightLabel?: string;
  value: number | null;
  onChange: (value: number) => void;
  theme: Theme;
  question?: string;
  required?: boolean;
};

export const NPS = ({
  leftLabel = 'Not likely',
  rightLabel = 'Very likely',
  value: rating,
  onChange,
  theme,
  question,
  required = false,
}: NPSProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const styles = useMemo(
    () => createNPSStyles(theme, containerWidth),
    [theme, containerWidth]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      {question ? (
        <Text style={styles.questionText}>
          {question}
          {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
        </Text>
      ) : null}
      <View style={styles.scaleContainer}>
        {Array.from({ length: NPS_SCALE_LENGTH }, (_, i) => {
          const value = i;
          const isSelected = rating === value;

          return (
            <Pressable
              key={value}
              style={({ pressed }) => [
                styles.ratingButton,
                isSelected && styles.ratingButtonSelected,
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
              ]}
              onPress={() => onChange(value)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${value} out of 10`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.ratingText,
                  isSelected && styles.ratingTextSelected,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.labelsContainer}>
        <Text style={[styles.label, styles.leftLabel]}>{leftLabel}</Text>
        <Text style={[styles.label, styles.rightLabel]}>{rightLabel}</Text>
      </View>
    </View>
  );
};
