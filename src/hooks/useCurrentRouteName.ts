import { useNavigationState } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export const useCurrentRouteName = () => {
  const [currentRouteName, setCurrentRouteName] = useState('');
  const state = useNavigationState((s) => s);

  useEffect(() => {
    if (state) {
      let route = state.routes[state.index];
      const pathResult: string[] = [];
      if (route) {
        pathResult.push(route.name);
        let subState = route.state;
        while (subState) {
          route = subState.routes[subState.index ?? 0] as any;
          if (route) {
            pathResult.push(route.name);
            subState = route.state;
          } else {
            subState = undefined;
          }
        }
      }
      setCurrentRouteName(pathResult.join('/'));
    }
  }, [state]);
  return currentRouteName;
};
