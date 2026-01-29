import { useEffect, useState, type RefObject } from 'react';
import type { Target } from '../types';
import { useActiveExperienceStore } from '../stores/useActiveExperienceStore';
import { useDataStore } from '../stores/useDataStore';
import type { NavigationContainerRef } from '@react-navigation/native';
import {
  TARGET_TYPE_ADDRESS_SIMPLE,
  TARGET_TYPE_USER_SEGMENT,
  TARGET_OPERATOR_SEGMENT_IS_NOT,
} from '../constants';

export const useTargeting = (
  navigationRef?: RefObject<NavigationContainerRef<any>>
) => {
  const [currentRouteName, setCurrentRouteName] = useState<string>();
  const surveys = useDataStore((s) => s.surveys);
  const setActiveExperience = useActiveExperienceStore(
    (s) => s.setActiveExperience
  );
  const progressorData = useDataStore((s) => s.progressorData);

  useEffect(() => {
    if (!navigationRef?.current) return;

    const updateRoute = () => {
      const route = navigationRef.current?.getCurrentRoute();
      setCurrentRouteName(route?.name);
    };

    // get initial route
    updateRoute();

    // Subscribe to future changes
    const unsubscribe = navigationRef.current.addListener('state', updateRoute);

    return unsubscribe;
  }, [navigationRef]);

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
          // Only show surveys with autoplay enabled
          if (!survey.trigger.autoplay) {
            return false;
          }

          if (uf_completed.some((completed) => completed.id === survey.id)) {
            return false;
          }
          if (survey.targets.length === 0) {
            return true;
          }

          // Evaluate all targets based on the survey's targetOperator
          const targetResults = survey.targets.map((target: Target) => {
            return evaluateTarget(
              target,
              currentRouteName,
              progressorData.autoSegment,
              progressorData.customSegments
            );
          });

          // targetOperator: 0 = all conditions must be true, 1 = any condition must be true
          return survey.targetOperator === 0
            ? targetResults.every((result) => result)
            : targetResults.some((result) => result);
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
    progressorData.autoSegment,
    progressorData.customSegments,
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

/**
 * Recursively evaluates a target or target group against current conditions
 * @param target - The target to evaluate (can be a simple target or a target group with nested targets)
 * @param path - Current route/screen name
 * @param autoSegment - Auto-assigned user segment
 * @param customSegments - Custom user segments
 * @returns true if the target matches, false otherwise
 */
const evaluateTarget = (
  target: Target,
  path?: string,
  autoSegment?: string,
  customSegments?: string[]
): boolean => {
  // Type guard: Check if this is a TargetGroup (has nested targets)
  if ('targets' in target) {
    const nestedResults = target.targets.map((nestedTarget: Target) =>
      evaluateTarget(nestedTarget, path, autoSegment, customSegments)
    );

    // Use the target group's own targetOperator
    return target.targetOperator === 0
      ? nestedResults.every((result: boolean) => result)
      : nestedResults.some((result: boolean) => result);
  }

  // Type guard: Handle individual target types based on discriminated union
  if (target.type === TARGET_TYPE_USER_SEGMENT) {
    const isInSegment = !!(
      target.formattedName &&
      (customSegments?.includes(target.formattedName) ||
        autoSegment === target.formattedName)
    );

    return target.operator === TARGET_OPERATOR_SEGMENT_IS_NOT
      ? !isInSegment
      : isInSegment;
  }

  if (target.type === TARGET_TYPE_ADDRESS_SIMPLE) {
    return !!path && path.includes(target.url);
  }

  // Fallback for unknown types
  return false;
};
