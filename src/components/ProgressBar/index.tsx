import { ProgressBarHorizontal } from '../ProgressBar/Horizontal';
import { ProgressBarDots } from '../ProgressBar/Dots';
import { ProgressBarStepNumbers } from '../ProgressBar/StepNumbers';

type ProgressProps = {
  progress: { state: boolean; type: number };
};

export const RenderProgressBar = ({ progress }: ProgressProps) => {
  if (!progress.state) return null;
  switch (progress.type) {
    case 2:
      return <ProgressBarDots />;
    case 3:
      return <ProgressBarStepNumbers />;
    case 1:
    default:
      return <ProgressBarHorizontal />;
  }
};
