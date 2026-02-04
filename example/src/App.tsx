import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useRef } from 'react';

import { Usetiful } from 'usetiful-react-native';

export default function App() {
  const USETIFUL_TOKEN = Constants.expoConfig?.extra?.USETIFUL_TOKEN;
  const navigationRef = useRef(null);

  return (
    <NavigationContainer ref={navigationRef}>
      <Usetiful
        token={USETIFUL_TOKEN}
        tags={{ userId: '2222' }}
        navigationRef={navigationRef}
      >
        <RootStack />
      </Usetiful>
    </NavigationContainer>
  );
}
