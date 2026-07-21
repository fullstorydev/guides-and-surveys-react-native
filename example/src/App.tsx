import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SurveysSDK } from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  const navigationRef = useRef(null);

  // Initialize the native SurveysSDK once on mount.
  useEffect(() => {
    SurveysSDK.initialize({ orgId: '3RWN', environment: 'staging' });
  }, []);

  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={navigationRef}>
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
