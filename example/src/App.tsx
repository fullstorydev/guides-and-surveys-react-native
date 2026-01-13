import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';

import { Usetiful } from 'usetiful-react-native';

export default function App() {
  const USETIFUL_TOKEN = Constants.expoConfig?.extra?.USETIFUL_TOKEN;

  return (
    <NavigationContainer>
      <Usetiful token={USETIFUL_TOKEN} tags={{ userId: '2222' }}>
        <RootStack />
      </Usetiful>
    </NavigationContainer>
  );
}
