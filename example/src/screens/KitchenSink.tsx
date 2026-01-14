import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NPS } from '../../../src/components/NPS/NPS';

/**
 * Kitchen Sink Screen - Demonstrates all Usetiful components and features
 */

function KitchenSinkScreen() {
  const [npsValue, setNpsValue] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <NPS value={npsValue} onChange={setNpsValue} />
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
