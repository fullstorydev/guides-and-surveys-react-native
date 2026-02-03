import { View, Text, Pressable } from 'react-native';
import type { Theme } from '../../types';
import { THEME_DEFAULT } from '../../constants';
import { useNPSStyles } from './useNPSStyles';

const NPS_SCALE = 10;

type NPSProps = {
  leftLabel?: string;
  rightLabel?: string;
  value: number | null;
  onChange: (value: number) => void;
  theme?: Theme;
};

export const NPS = ({
  leftLabel = 'Not likely',
  rightLabel = 'Very likely',
  value: rating,
  onChange,
  theme = THEME_DEFAULT,
}: NPSProps) => {
  const styles = useNPSStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.scaleContainer}>
        {Array.from({ length: NPS_SCALE }, (_, i) => {
          const value = i + 1;
          const isSelected = rating === value;

          return (
            <Pressable
              key={value}
              style={[
                styles.ratingButton,
                isSelected && styles.ratingButtonSelected,
              ]}
              onPress={() => onChange(value)}
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
