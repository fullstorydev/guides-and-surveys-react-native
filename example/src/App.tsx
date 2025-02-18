import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';

import { Usetiful } from 'usetiful-react-native';

export default function App() {
  return (
    <NavigationContainer>
      <Usetiful
        token="7618802c6fed361935f6fba6b2222fcb"
        tags={{ userId: '2222' }}
      >
        <RootStack />
      </Usetiful>
    </NavigationContainer>
  );
}
