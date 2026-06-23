import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  initialize(orgId: string, environment: string, userId: string): Promise<void>;
  identify(userId: string): Promise<void>;
  showSurvey(surveyId: string | null): Promise<void>;
  getAreSurveysDisabled(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNGuidesAndSurveys');
