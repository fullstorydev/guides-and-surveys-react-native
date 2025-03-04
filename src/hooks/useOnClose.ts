import { useStore } from '../stores/useStore';
import type { ProgressorData } from '../types';

export const useOnClose = () => {
  const progressorData = useStore((s) => s.progressorData);
  const setProgressorData = useStore((s) => s.setProgressorData);
  const availableTour = useStore((s) => s.availableTour);
  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const setSelfClosed = useStore((s) => s.setSelfClosed);

  const onCloseHandler = () => {
    if (availableTour) {
      const newPD: ProgressorData = { ...progressorData };

      const tour = newPD.tours?.find(
        (t) => t.id.toString() === availableTour?.id.toString()
      );

      const isLastStep = availableTour.steps.length === tourStepIndex + 1;

      if (tour) {
        if (isLastStep) {
          tour.currentStep = 0;
        }
        tour.state = 'closed';
      } else {
        const newProgressorTour = {
          id: availableTour.id ?? '',
          state: 'closed',
          name: availableTour.name ?? '',
          currentStep: tourStepIndex,
          updatedAt: '',
        };
        if (isLastStep) {
          newProgressorTour.currentStep = 0;
        }
        newPD.tours.push();
      }
      setProgressorData(newPD);
      setSelfClosed(true);
    }
  };

  return { onCloseHandler };
};
