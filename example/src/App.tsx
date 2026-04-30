import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  GuidesAndSurveys,
  SurveysSDK,
} from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  // TODO: consider automatic orgID detection
  const orgId = 'o-1Y9Z-na1';
  const navigationRef = useRef(null);

  // Initialize the native SurveysSDK once on mount.
  useEffect(() => {
    // north star test org
    SurveysSDK.initialize({ orgId: '3RWN', environment: 'staging' });
  }, []);

  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={navigationRef}>
        <GuidesAndSurveys
          orgId={orgId}
          environment="playpen"
          navigationRef={navigationRef}
        >
          <RootStack />
        </GuidesAndSurveys>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
