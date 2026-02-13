import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import { useRef } from 'react';

import { Usetiful } from 'usetiful-react-native';

export default function App() {
  // TODO: consider automatic orgID detection
  const orgId = 'o-1Y9Z-na1';
  const navigationRef = useRef(null);

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
