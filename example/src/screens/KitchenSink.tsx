import { View, ScrollView, StyleSheet } from 'react-native';
import { NPS } from '../../../src/components/NPS/NPS';

/**
 * Kitchen Sink Screen - Demonstrates all Usetiful components and features
 */

function KitchenSinkScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <NPS />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
});

export default KitchenSinkScreen;
