import { RootStack, type RootStackParamList } from './RootStack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={navigationRef}>
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
