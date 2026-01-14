import { View, Text, Pressable, StyleSheet } from 'react-native';

const NPS_SCALE = 10;

type NPSProps = {
  leftLabel?: string;
  rightLabel?: string;
  value: number | null;
  onChange: (value: number) => void;
};

export const NPS = ({
  leftLabel = 'Not likely',
  rightLabel = 'Very likely',
  value: rating,
  onChange,
}: NPSProps) => {
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  ratingButton: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  ratingButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  ratingTextSelected: {
    color: '#FFFFFF',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
  leftLabel: {
    textAlign: 'left',
  },
  rightLabel: {
    textAlign: 'right',
  },
});
