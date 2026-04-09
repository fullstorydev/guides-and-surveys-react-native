import { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { Theme } from '../../types';
import {
  createNPSStyles,
  NPS_SCALE_LENGTH,
  NPS_ROW1_COUNT,
} from './createNPSStyles';

type NPSProps = {
  leftLabel?: string;
  rightLabel?: string;
  value: number | null;
  onChange: (value: number) => void;
  theme: Theme;
  titleAlignment?: 'left' | 'right' | 'center';
  question?: string;
  required?: boolean;
  hasError?: boolean;
};

export const NPS = ({
  leftLabel = 'Not likely',
  rightLabel = 'Very likely',
  value: rating,
  onChange,
  theme,
  question,
  titleAlignment = 'left',
  required = false,
  hasError = false,
}: NPSProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const { styles, shouldWrap } = useMemo(
    () => createNPSStyles(theme, containerWidth, titleAlignment),
    [theme, containerWidth, titleAlignment]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const allValues = Array.from({ length: NPS_SCALE_LENGTH }, (_, i) => i);
  const rows = shouldWrap
    ? [allValues.slice(0, NPS_ROW1_COUNT), allValues.slice(NPS_ROW1_COUNT)]
    : [allValues];

  const renderButton = (value: number) => {
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
        accessibilityLabel={`Rate ${value} out of ${NPS_SCALE_LENGTH - 1}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text style={styles.ratingText}>{value}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      {question ? (
        <Text style={styles.questionText}>
          {question}
          {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
        </Text>
      ) : null}
      <View
        style={[styles.scaleContainer, hasError && styles.scaleContainerError]}
      >
        {rows.map((rowValues, rowIndex) => (
          <View key={rowIndex} style={styles.scaleRow}>
            {rowValues.map(renderButton)}
          </View>
        ))}
      </View>

      <View style={styles.labelsContainer}>
        <Text style={[styles.label, styles.leftLabel]}>
          {'0 - ' + leftLabel}
        </Text>
        <Text style={[styles.label, styles.rightLabel]}>
          {NPS_SCALE_LENGTH - 1 + ' - ' + rightLabel}
        </Text>
      </View>
    </View>
  );
};
