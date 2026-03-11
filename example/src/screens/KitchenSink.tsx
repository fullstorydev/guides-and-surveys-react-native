import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NPS } from '../../../src/components/NPS/NPS';
import { THEME_DEFAULT } from '../../../src/constants';
import { OpenQuestion } from '../../../src/components/OpenQuestion/OpenQuestion';

/**
 * Kitchen Sink Screen - Demonstrates all Usetiful components and features
 */

function KitchenSinkScreen() {
  const [npsValue, setNpsValue] = useState<number | null>(null);
  const [openQuestionValue, setOpenQuestionValue] = useState<string>('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <NPS
          value={npsValue}
          onChange={setNpsValue}
          theme={THEME_DEFAULT}
          question="How likely are you to recommend this product to a friend or colleague?"
          required={true}
        />
        <OpenQuestion
          value={openQuestionValue}
          onChange={setOpenQuestionValue}
          theme={THEME_DEFAULT}
          question="What is do you like about the product?"
          required={true}
        />
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
