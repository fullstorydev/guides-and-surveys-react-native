import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';

import { Usetiful } from 'usetiful-react-native';

export default function App() {
  return (
    <NavigationContainer>
      <Usetiful token="34ae1d22e7615d614bd3a17920a907c0">
        <RootStack />
      </Usetiful>
    </NavigationContainer>
  );
}
