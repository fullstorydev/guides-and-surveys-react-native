import { View, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  checkColor?: string;
  circleColor?: string;
};

const CheckmarkIcon = ({
  size = 40,
  checkColor = '#fff',
  circleColor = '#00b65e',
}: Props) => {
  const checkWidth = size * 0.4;
  const checkHeight = size * 0.25;
  const strokeWidth = Math.max(2, size * 0.07);

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: circleColor,
        },
      ]}
    >
      <View
        style={{
          width: checkWidth,
          height: checkHeight,
          borderBottomWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderColor: checkColor,
          transform: [
            { rotate: '-45deg' },
            { translateX: size * 0.03 },
            { translateY: size * -0.03 },
          ],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckmarkIcon;
