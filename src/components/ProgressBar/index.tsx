import { ProgressBarHorizontal } from '../ProgressBar/Horizontal';
import { ProgressBarDots } from '../ProgressBar/Dots';
import { ProgressBarStepNumbers } from '../ProgressBar/StepNumbers';
import { ProgressBarCircle } from '../ProgressBar/Circle';

type ProgressProps = {
  progress: { state: boolean; type: number };
};

export const RenderProgressBar = ({ progress }: ProgressProps) => {
  if (!progress.state) return null;
  switch (progress.type) {
    case 1:
      return <ProgressBarHorizontal />;
    case 2:
      return <ProgressBarDots />;
    case 3:
      return <ProgressBarStepNumbers />;
    case 4:
      return <ProgressBarCircle />;
    default:
      return null;
  }
};
