import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { useCurrentRouteName } from './useCurrentRouteName';
import type { Survey, Target } from '../types';
import { useActiveExperienceStore } from '../stores/useActiveExperienceStore';
import { useDataStore } from '../stores/useDataStore';

export const useTargetting = () => {
  const currentRouteName = useCurrentRouteName();
  const tours = useDataStore((s) => s.tours);
  const surveys = useDataStore((s) => s.surveys);
  const setActiveExperience = useActiveExperienceStore(
    (s) => s.setActiveExperience
  );
  const setAvailableTour = useStore((s) => s.setAvailableTour);
  const progressorData = useStore((s) => s.progressorData);

  /**
   * Targetting for current experience. Deterimines the current active experience. Only surveys for now.
   */
  useEffect(() => {
    if (surveys && surveys.length) {
      // TODO, all surveys are valid for now.
      // TODO check if survey is incomplete - no progressor data

      const activeSurveys = surveys.filter((survey) => {
        if (survey.targets.length === 0) {
          return true;
        }
        return survey.targets.some((target: Target) => {
          return checkByTargets({ target, path: currentRouteName });
        });
      });

      setActiveExperience({
        type: 'survey',
        experience: activeSurveys[0] as Survey,
        currentPageIndex: 0,
      });
    }
  }, [surveys, currentRouteName, setActiveExperience]);

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
        .sort((a, b) => b.objectPriority - a.objectPriority); // Sort by objectPriority (descending)

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
