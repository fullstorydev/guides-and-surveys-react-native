import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { useCurrentRouteName } from './useCurrentRouteName';
import type { Target } from '../types';

export const useTargetting = () => {
  const currentRouteName = useCurrentRouteName();
  const tours = useStore((s) => s.tours);
  const setAvailableTour = useStore((s) => s.setAvailableTour);
  const progressorData = useStore((s) => s.progressorData);

  useEffect(() => {
    if (tours && tours.length) {
      const avTour = tours.find((tour) => {
        if (tour.targets) {
          const conditions = tour.targets.map((target) =>
            checkByTargets({
              target,
              path: currentRouteName,
              autoSegment: progressorData?.autoSegment,
              customSegments: progressorData?.customSegments,
            })
          );

          if (tour.targetOperator === 0) {
            return conditions.every((c) => c);
          } else {
            return conditions.some((c) => c);
          }
        }
        return undefined;
      });

      let currentStep: number = 0;
      if (avTour?.rememberLastStep) {
        currentStep =
          progressorData?.tours?.find(
            (t) => t.id.toString() === avTour?.id.toString()
          )?.currentStep ?? 0;
      }
      setAvailableTour(avTour, currentStep);
    } else {
      setAvailableTour(undefined);
    }
  }, [
    currentRouteName,
    progressorData?.autoSegment,
    progressorData?.customSegments,
    progressorData?.tours,
    setAvailableTour,
    tours,
  ]);
};

const checkByTargets = ({
  target,
  path,
  autoSegment,
  customSegments,
}: {
  target: Target;
  path?: string;
  autoSegment?: string;
  customSegments?: string[];
}) => {
  switch (target.type) {
    case 'user-segment':
      return (
        target.formattedName &&
        (customSegments?.includes(target.formattedName) ||
          autoSegment === target.formattedName)
      );
    case 'address-simple':
    default:
      return !!target.url && path?.includes(target.url);
  }
};
