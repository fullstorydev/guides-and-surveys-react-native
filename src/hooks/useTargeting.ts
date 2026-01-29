import { useEffect } from 'react';
import { useCurrentRouteName } from './useCurrentRouteName';
import type { Target } from '../types';
import { useActiveExperienceStore } from '../stores/useActiveExperienceStore';
import { useDataStore } from '../stores/useDataStore';

export const useTargeting = () => {
  const currentRouteName = useCurrentRouteName();
  const surveys = useDataStore((s) => s.surveys);
  const setActiveExperience = useActiveExperienceStore(
    (s) => s.setActiveExperience
  );
  const progressorData = useDataStore((s) => s.progressorData);

  // TODO: reintegrate tours
  // const tours = useStore((s) => s.tours);
  // const setAvailableTour = useStore((s) => s.setAvailableTour);
  // const progressorData = useStore((s) => s.progressorData);

  /**
   * Targetting for current experience. Deterimines the current active experience. Only surveys for now.
   */
  useEffect(() => {
    if (surveys && surveys.length) {
      const uf_completed = progressorData.uf_completed || [];

      const activeSurveys = surveys
        .filter((survey) => {
          if (uf_completed.some((completed) => completed.id === survey.id)) {
            return false;
          }
          if (survey.targets.length === 0) {
            return true;
          }
          return survey.targets.some((target: Target) => {
            return checkByTargets({ target, path: currentRouteName });
          });
        })
        .sort((a, b) => b.objectPriority - a.objectPriority);

      if (activeSurveys[0]) {
        setActiveExperience({
          type: 'survey',
          experience: activeSurveys[0],
          currentPageIndex: 0,
        });
      } else {
        // TODO: this logic will change once we have other experience types
        setActiveExperience(null);
      }
    }
  }, [
    surveys,
    currentRouteName,
    setActiveExperience,
    progressorData.uf_completed,
  ]);

  // TODO: reintegrate tours
  // useEffect(() => {
  //   if (tours && tours.length) {
  //     const validTours = tours
  //       .filter((tour) => {
  //         if (tour.targets) {
  //           // Check if tour was displayed before and has status "closed"
  //           const isJustOnceAndClosed =
  //             (tour.trigger === undefined || tour.trigger?.type === 'once') &&
  //             progressorData?.tours?.some(
  //               (t) =>
  //                 t.id.toString() === tour.id.toString() && t.state === 'closed'
  //             );

  //           if (isJustOnceAndClosed) {
  //             return false;
  //           }
  //           const conditions = tour.targets.map((target) =>
  //             checkByTargets({
  //               target,
  //               path: currentRouteName,
  //               autoSegment: progressorData?.autoSegment,
  //               customSegments: progressorData?.customSegments,
  //             })
  //           );

  //           return tour.targetOperator === 0
  //             ? conditions.every((c) => c)
  //             : conditions.some((c) => c);
  //         }
  //         return false;
  //       })
  //       .sort((a, b) => b.objectPriority - a.objectPriority); // Sort by objectPriority (descending)

  //     const avTour = validTours.length ? validTours[0] : undefined; // We choose tour with smallest (means highest) objectPriority

  //     const currentStep =
  //       progressorData?.tours?.find(
  //         (t) => t.id.toString() === avTour?.id.toString()
  //       )?.currentStep ?? 0;

  //     setAvailableTour(avTour, currentStep);
  //   } else {
  //     setAvailableTour(undefined);
  //   }
  // }, [
  //   currentRouteName,
  //   progressorData?.autoSegment,
  //   progressorData?.customSegments,
  //   progressorData?.tours,
  //   setAvailableTour,
  //   tours,
  // ]);
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
