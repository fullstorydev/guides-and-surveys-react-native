import { RootStack } from './RootStack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SurveysSDK } from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef('');

  // Initialize the native SurveysSDK once on mount.
  useEffect(() => {
    SurveysSDK.initialize({ orgId: 'o-1Y9Z-na1', environment: 'playpen' });
  }, []);

  return (
    <GestureHandlerRootView>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute()?.name ?? '';
        }}
        onStateChange={() => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute()?.name ?? '';

          if (previousRouteName !== currentRouteName) {
            routeNameRef.current = currentRouteName;

            console.log('setting current screen', currentRouteName);
            SurveysSDK.setCurrentScreen(currentRouteName);
          }
        }}
      >
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
