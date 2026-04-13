import { View, Text, StyleSheet } from 'react-native';
import type { Theme } from '../types';
import CheckmarkIcon from './CheckmarkIcon';
import { CrossBtn } from './Cross';
import { resolveFont } from '../utils/fonts';

type Props = {
  content: string;
  theme: Theme;
  onClose: () => void;
};

const ThankYouPage = ({ content, theme, onClose }: Props) => {
  return (
    <View>
      <View style={styles.header}>
        <CrossBtn onClose={onClose} color={theme.surveyCloseIconColor} />
      </View>
      <View style={styles.container}>
        <CheckmarkIcon />
        <Text
          style={[
            styles.content,
            {
              color: theme.fontContentColor,
              fontSize: theme.fontSize,
              fontFamily: resolveFont(theme.fontFamily, theme.customFontFamily),
            },
          ]}
        >
          {content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 8,
    gap: 16,
  },
  content: {
    textAlign: 'center',
  },
});

export default ThankYouPage;
