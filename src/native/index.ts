import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import type { Spec } from '../NativeGuidesAndSurveys';

export type SurveysEnvironment = 'playpen' | 'staging' | 'production';

export type SurveyInfo = {
  id: string;
  name: string;
  active: boolean;
  priority: number;
  pageType: string;
  questionCount: number;
  completed: boolean;
};

export interface SurveysSDKConfig {
  /** FullStory org ID, e.g. "o-24JBZ9-na1" */
  orgId: string;
  /** Defaults to "playpen" */
  environment?: SurveysEnvironment;
  /** Defaults to "anonymous" */
  userId?: string;
}

const LINKING_ERROR =
  `The native RNGuidesAndSurveys module could not be found. ` +
  `On iOS: make sure you have run pod install and rebuilt the app. ` +
  `On Android: make sure the guides-and-surveys module is included in settings.gradle and the app is rebuilt.`;

function getModule(): Spec | null {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // TurboModuleRegistry.get returns null on old arch (no TurboModule registered),
    // so we fall back to the classic NativeModules bridge.
    const mod =
      TurboModuleRegistry.get<Spec>('RNGuidesAndSurveys') ??
      (NativeModules.RNGuidesAndSurveys as Spec | undefined) ??
      null;
    if (!mod) {
      console.warn(LINKING_ERROR);
    }
    return mod;
  }
  return null;
}

const mod = getModule();

/**
 * React Native bridge for the native iOS/Android GuidesAndSurveys SDK.
 *
 * Uses TurboModules when available (new arch) and falls back to the
 * classic NativeModules bridge on old arch.
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

  /**
   * Set the FullStory session ID. Call this once the FullStory SDK fires its
   * ready callback and provides a session ID.
   */
  setSessionId(sessionId: string): Promise<void> {
    if (!mod) return Promise.resolve();
    return mod.setSessionId(sessionId);
  },

  /**
   * Notify the SDK of the current screen name for survey targeting.
   * Pass `null` to clear the current screen.
   */
  setCurrentScreen(screenName: string | null): Promise<void> {
    if (!mod) return Promise.resolve();
    return mod.setCurrentScreen(screenName);
  },

  /**
   * Returns the list of surveys known to the SDK, with their completion status.
   */
  getSurveys(): Promise<ReadonlyArray<SurveyInfo>> {
    if (!mod) return Promise.resolve([]);
    return mod.getSurveys() as Promise<ReadonlyArray<SurveyInfo>>;
  },
} as const;

export default SurveysSDK;
