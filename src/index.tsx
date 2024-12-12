import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import type { Measure, UsetifulResponse } from './types';
import { Modal } from './components/Modal';
import { useStore } from './stores/useStore';
import { Pointer } from './components/Pointer';
import { Slideout } from './components/Slideout';
export { setPointer } from './utils/setPointer';

const useCurrentRouteName = () => {
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

type Props = {
  token: string;
} & PropsWithChildren;

export const Usetiful = ({ children, token }: Props) => {
  const currentRouteName = useCurrentRouteName();

  const tours = useStore((s) => s.tours);
  const setTours = useStore((s) => s.setTours);
  const setTourStepIndex = useStore((s) => s.setTourStepIndex);
  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const availableTour = useStore((s) => s.availableTour);
  const setAvailableTour = useStore((s) => s.setAvailableTour);
  const [layoutMeasure, setLayoutMeasure] = useState<Measure>();

  useEffect(() => {
    const fetchData = () => {
      fetch('https://www.usetiful.com/api-space/data.json?lang=en', {
        method: 'GET',
        headers: {
          'X-Auth-Token': token,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          response.json().then((res: UsetifulResponse) => {
            setTours(res.tours);
            console.log(`
              =============================================
              =============================================
              ============== USETIFUL =====================
              ================= IS ========================
              ============== LOADED =======================
              =============================================
              =============================================`);
          });
        })
        .catch((error) => {
          console.log('=====error====>', error.message);
        });
    };
    if (fetchData) fetchData();
  }, [setTours, token]);

  useEffect(() => {
    setTourStepIndex(0);
    if (tours && tours.length) {
      setAvailableTour(
        tours.find((tour) => {
          if (tour.targets) {
            return tour.targets.find(
              (target) => !!target.url && currentRouteName.includes(target.url)
            );
          }
          return undefined;
        })
      );
    } else {
      setAvailableTour(undefined);
    }
  }, [currentRouteName, setAvailableTour, setTourStepIndex, tours]);

  useEffect(() => {
    setSelfClosed(false);
  }, [currentRouteName]);
  const [selfClosed, setSelfClosed] = useState(false);

  const step =
    !!availableTour && !selfClosed && availableTour.steps[tourStepIndex]
      ? availableTour.steps[tourStepIndex]
      : undefined;

  const refs = useStore((s) => s.pointers);

  const stepType = useMemo(() => {
    if (step && step.type !== 'pointer') return step.type;
    else if (step?.type === 'pointer')
      return refs[step.element] ? 'pointer' : 'slideout';
    else return undefined;
  }, [refs, step]);

  return (
    <View
      style={styles.UsetifulContainer}
      onLayout={(e) => {
        e.target.measure((x, y, width, height, pageX, pageY) => {
          if (
            ![x, y, width, height, pageX, pageY].some((i) => i === undefined)
          ) {
            setLayoutMeasure({ x, y, width, height, pageX, pageY } as Measure);
          }
        });
      }}
    >
      {children}
      {step && (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.usetifulLayer,
            backgroundColor: stepType === 'modal' ? '#000000cc' : 'transparent',
            justifyContent: stepType === 'slideout' ? 'flex-end' : 'flex-start',
          }}
        >
          {stepType === 'modal' && (
            <Modal step={step} onColse={() => setSelfClosed(true)} />
          )}
          {stepType === 'pointer' && (
            <Pointer
              step={step}
              onColse={() => setSelfClosed(true)}
              layoutMeasure={layoutMeasure}
            />
          )}
          {stepType === 'slideout' && (
            <Slideout step={step} onColse={() => setSelfClosed(true)} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  UsetifulContainer: {
    flex: 1,
  },
  usetifulLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
  },
  footerBtn: {
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
  primaryBtn: {
    backgroundColor: '#387DFF',
  },
  secondaryBrn: {
    borderColor: '#464646',
    borderWidth: 1,
  },
});
