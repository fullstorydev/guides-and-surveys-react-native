import { View, StyleSheet } from 'react-native';
import { useStore } from '../../../stores/useStore';

export const ProgressBarCircle = () => {
  const tourStepIndex = useStore((s) => s.tourStepIndex) + 1;
  const tourStepLength = useStore((s) => s.tourStepLength);
  const progressWidth = (100 / tourStepLength) * tourStepIndex;

  let leftRotation = 0;
  let rightRotation = (progressWidth * 180) / 100; // Right fills first

  if (progressWidth > 50) {
    rightRotation = 180;
    leftRotation = ((progressWidth - 50) * 180) / 50; // Left fills after 50%
  }

  return (
    <View style={styles.container}>
      <View style={styles.circleProgress}>
        {/* Right Half (First 50%) */}
        <View style={[styles.halfCircle, styles.rightHalf]}>
          <View
            style={[
              styles.progressSegment,
              { transform: [{ rotate: `${rightRotation}deg` }] },
            ]}
          />
        </View>

        {/* Left Half (Second 50%) */}
        <View style={[styles.halfCircle, styles.leftHalf]}>
          <View
            style={[
              styles.progressSegment,
              { transform: [{ rotate: `${leftRotation}deg` }] },
            ]}
          />
        </View>

        {/* Inner Circle (To Make Ring Effect) */}
        <View style={styles.innerCircle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  circleProgress: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0', // Background color (unfilled area)
    position: 'relative',
    overflow: 'hidden',
  },
  halfCircle: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  leftHalf: {
    left: 0,
  },
  rightHalf: {
    right: 0,
  },
  progressSegment: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'blue', // Adjust progress color
    position: 'absolute',
    top: 0,
    left: 0,
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF', // Inner white circle
    position: 'absolute',
    top: 5,
    left: 5,
  },
});

export default ProgressBarCircle;
