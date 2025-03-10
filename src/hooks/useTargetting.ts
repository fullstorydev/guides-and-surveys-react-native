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
      const validTours = tours
        .filter((tour) => {
          if (tour.targets) {
            // Check if tour was displayed before and has status "closed"
            const isJustOnceAndClosed =
              (tour.trigger === undefined || tour.trigger?.type === 'once') &&
              progressorData?.tours?.some(
                (t) =>
                  t.id.toString() === tour.id.toString() && t.state === 'closed'
              );

            if (isJustOnceAndClosed) {
              return false;
            }
            const conditions = tour.targets.map((target) =>
              checkByTargets({
                target,
                path: currentRouteName,
                autoSegment: progressorData?.autoSegment,
                customSegments: progressorData?.customSegments,
              })
            );

            return tour.targetOperator === 0
              ? conditions.every((c) => c)
              : conditions.some((c) => c);
          }
          return false;
        })
        .sort((a, b) => a.objectPriority - b.objectPriority); // Sort by objectPriority (ascending)

      const avTour = validTours.length ? validTours[0] : undefined; // We choose tour with smallest (means highest) objectPriority

      const currentStep =
        progressorData?.tours?.find(
          (t) => t.id.toString() === avTour?.id.toString()
        )?.currentStep ?? 0;

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
