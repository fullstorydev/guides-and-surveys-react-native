import { View, StyleSheet, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import KitchenSinkScreen from './screens/KitchenSink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fullstory from '@fullstory/react-native';

export type RootStackParamList = {
  Home: undefined;
  KitchenSink: undefined;
};

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.home}>
      <View style={styles.navContainer}>
        <View style={styles.navBtn}>
          <Button
            title="Kitchen Sink"
            onPress={() => navigation.navigate('KitchenSink')}
          />
        </View>
        <View style={styles.navBtn}>
          <Button
            title="Clear Async Storage"
            onPress={() => AsyncStorage.clear()}
          />
        </View>
        <View style={styles.navBtn}>
          <Button
            title="Fullstory Identify"
            onPress={() => Fullstory.identify('1234567890')}
          />
          <Button
            title="Fullstory Set User Properties"
            onPress={() => Fullstory.setUserVars({ name: 'John Doe' })}
          />
          <Button
            title="Fullstory Anonymize"
            onPress={() => Fullstory.anonymize()}
          />
          <Button
            title="Get Session Id"
            onPress={() => {
              Fullstory.getCurrentSession().then((session) => {
                console.log('session', session);
              });
            }}
          />
          <Button
            title="Shutdown Fullstory"
            onPress={() => {
              Fullstory.shutdown();
            }}
          />
          <Button
            title="Restart Fullstory"
            onPress={() => {
              Fullstory.restart();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="KitchenSink" component={KitchenSinkScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
  detail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
  navContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  navBtn: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
