import { NativeModules, Platform } from 'react-native';

export type SurveysEnvironment = 'playpen' | 'staging' | 'production';

export interface SurveysSDKConfig {
  /** FullStory org ID, e.g. "o-24JBZ9-na1" */
  orgId: string;
  /** Defaults to "playpen" */
  environment?: SurveysEnvironment;
  /** Defaults to "anonymous" */
  userId?: string;
}

const LINKING_ERROR =
  `The native SurveysSDK module could not be found. ` +
  `On iOS: make sure you have run pod install and rebuilt the app. ` +
  `On Android: make sure the surveys-sdk module is included in settings.gradle and the app is rebuilt.`;

function getModule() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const mod = NativeModules.RNSurveysSDK;
    if (!mod) {
      console.warn(LINKING_ERROR);
    }
    return mod ?? null;
  }
  return null;
}

const mod = getModule();

/**
 * React Native bridge for the native iOS SurveysSDK.
 *
 * On Android this is a no-op until an Android SDK is available.
 */
export const SurveysSDK = {
  /**
   * Initialize the SDK. Must be called once before any other method.
   * Automatically attaches the survey overlay to the root view controller.
   */
  initialize(config: SurveysSDKConfig): Promise<void> {
    if (!mod) return Promise.resolve();
    return mod.initialize(
      config.orgId,
      config.environment ?? 'playpen',
      config.userId ?? ''
    );
  },

  /**
   * Associate a user identity with survey responses.
   * Call whenever the logged-in user changes.
   */
  identify(userId: string): Promise<void> {
    if (!mod) return Promise.resolve();
    return mod.identify(userId);
  },

  /**
   * Manually trigger a survey.
   * If `surveyId` is omitted the SDK picks the next eligible autoplay survey.
   */
  showSurvey(surveyId?: string): Promise<void> {
    if (!mod) return Promise.resolve();
    return mod.showSurvey(surveyId ?? null);
  },

  /** Returns true if surveys are currently suppressed. */
  areSurveysDisabled(): Promise<boolean> {
    if (!mod) return Promise.resolve(false);
    return mod.getAreSurveysDisabled();
  },
} as const;

export default SurveysSDK;
