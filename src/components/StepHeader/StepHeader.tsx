import { StyleSheet, Text, View } from 'react-native';
import { CrossBtn } from '../Cross';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { RenderProgressBar } from '../ProgressBar';
import { useOnClose } from '../../hooks/useOnClose';
import { resolveFont } from '../../utils/fonts';
import { THEME_DEFAULT } from '../../constants';

type Props = {
  title: string;
};
export const StepHeader = ({ title }: Props) => {
  const theme = useStore((s) => s.theme);
  const progress = useStore((s) => s.progress);
  const { onCloseHandler } = useOnClose();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        text: {
          textAlign: 'center',
          fontSize: theme.fontTitleSize || theme.fontSize * 1.5,
          fontFamily: resolveFont(
            theme.fontTitleFamily,
            theme.customFontTitleFamily
          ),
          fontWeight: '600',
          color: theme.fontColor,
        },
      }),
    [theme]
  );

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>{title}</Text>
        <CrossBtn
          onClose={onCloseHandler}
          color={THEME_DEFAULT.surveyCloseIconColor}
        />
      </View>
      {progress.type === 1 && <RenderProgressBar />}
    </>
  );
};
