import { View, ScrollView, StyleSheet, Text } from 'react-native';

/**
 * Kitchen Sink Screen - Demonstrates all Guides And Surveys components and features
 */

function KitchenSinkScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text>Kitchen Sink</Text>
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default KitchenSinkScreen;
