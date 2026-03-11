import { useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import type { Theme } from '../../types';
import { createOpenQuestionStyles } from './createOpenQuestionStyles';

type OpenQuestionProps = {
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
  question?: string;
  required?: boolean;
  titleAlignment?: 'left' | 'right' | 'center';
  placeholder?: string;
};

export const OpenQuestion = ({
  value,
  onChange,
  theme,
  question,
  placeholder,
  required = false,
  titleAlignment = 'left',
}: OpenQuestionProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const styles = useMemo(
    () => createOpenQuestionStyles(theme, titleAlignment),
    [theme, titleAlignment]
  );

  return (
    <View style={styles.container}>
      {question ? (
        <Text style={styles.questionText}>
          {question}
          {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
        </Text>
      ) : null}
      <TextInput
        style={[styles.textInput, isFocused && styles.textInputFocused]}
        value={value}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline
        numberOfLines={5}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        textAlignVertical="top"
        accessibilityLabel={question}
      />
    </View>
  );
};
