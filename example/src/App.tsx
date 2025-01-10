import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';

import { Usetiful } from 'usetiful-react-native';

export default function App() {
  return (
    <NavigationContainer>
      <Usetiful token="65318218e671bc163c9306ddd37ccb3b">
        <RootStack />
      </Usetiful>
    </NavigationContainer>
  );
}
