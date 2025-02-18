"use strict";

import { useEffect } from 'react';
import { useStore } from "../stores/useStore.js";
import { useCurrentRouteName } from "./useCurrentRouteName.js";
export const useTargetting = () => {
  const currentRouteName = useCurrentRouteName();
  const tours = useStore(s => s.tours);
  const setTourStepIndex = useStore(s => s.setTourStepIndex);
  const setAvailableTour = useStore(s => s.setAvailableTour);
  const progressorData = useStore(s => s.progressorData);
  useEffect(() => {
    if (tours && tours.length) {
      const avTour = tours.find(tour => {
        if (tour.targets) {
          const conditions = tour.targets.map(target => checkByTargets({
            target,
            path: currentRouteName,
            autoSegment: progressorData?.autoSegment,
            customSegments: progressorData?.customSegments
          }));
          if (tour.targetOperator === 0) {
            return conditions.every(c => c);
          } else {
            return conditions.some(c => c);
          }
        }
        return undefined;
      });
      const currentStep = progressorData?.tours?.find(t => t.id.toString() === avTour?.id.toString())?.currentStep ?? 0;
      setAvailableTour(avTour, currentStep);
    } else {
      setAvailableTour(undefined);
    }
  }, [currentRouteName, progressorData, setAvailableTour, setTourStepIndex, tours]);
};
const checkByTargets = ({
  target,
  path,
  autoSegment,
  customSegments
}) => {
  switch (target.type) {
    case 'user-segment':
      return target.formattedName && (customSegments?.includes(target.formattedName) || autoSegment === target.formattedName);
    case 'address-simple':
    default:
      return !!target.url && path?.includes(target.url);
  }
};
//# sourceMappingURL=useTargetting.js.map