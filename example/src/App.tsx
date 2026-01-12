import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';

import { UsetifulTemp } from 'usetiful-react-native';

export default function App() {
  const USETIFUL_TOKEN = Constants.expoConfig?.extra?.USETIFUL_TOKEN;

  return (
    <NavigationContainer>
      <UsetifulTemp token={USETIFUL_TOKEN} tags={{ userId: '2222' }}>
        <RootStack />
      </UsetifulTemp>
    </NavigationContainer>
  );
}
