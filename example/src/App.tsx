import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import { useRef } from 'react';

import { Usetiful } from 'usetiful-react-native';
import Fullstory from '@fullstory/react-native';

export default function App() {
  // TODO: consider automatic orgID detection
  const orgId = 'o-1Y9Z-na1';
  const navigationRef = useRef(null);

  Fullstory.onReady().then(function (result: any) {
    const replayStartUrl = result.replayStartUrl;
    const replayNowUrl = result.replayNowUrl;
    const sessionId = result.sessionId;
    console.log('replayStartUrl: ', replayStartUrl);
    console.log('replayNowUrl: ', replayNowUrl);
    console.log('sessionId: ', sessionId);

    Fullstory.identify('testz7@test.com', {
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <Usetiful
        orgId={orgId}
        tags={{ userId: '2222' }}
        navigationRef={navigationRef}
      >
        <RootStack />
      </Usetiful>
    </NavigationContainer>
  );
}
