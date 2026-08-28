import { RootStack, type RootStackParamList } from './RootStack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useRef, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SurveysSDK } from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const routeNameRef = useRef('');
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isNavReady, setIsNavReady] = useState(false);

  useEffect(() => {
    SurveysSDK.initialize({ orgId: 'o-1Y9Z-na1', environment: 'playpen' }).then(
      () => setIsSdkReady(true)
    );
  }, []);

  // Send the initial screen once both the SDK and navigation are ready,
  // regardless of which one finishes first.
  useEffect(() => {
    if (!isSdkReady || !isNavReady) return;
    const currentRouteName = navigationRef.getCurrentRoute()?.name ?? '';
    routeNameRef.current = currentRouteName;
    SurveysSDK.setCurrentScreen(currentRouteName);
  }, [isSdkReady, isNavReady, navigationRef]);

  return (
    <GestureHandlerRootView>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => setIsNavReady(true)}
        onStateChange={() => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute()?.name ?? '';

          if (previousRouteName !== currentRouteName) {
            routeNameRef.current = currentRouteName;
            SurveysSDK.setCurrentScreen(currentRouteName);
          }
        }}
      >
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
