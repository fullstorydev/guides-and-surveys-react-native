import type { GuidesAndSurveysApi } from './api';
import type { ProgressorData } from '../types';
import { withRetry } from '../utils/retry';

// Debounce timer to batch rapid changes
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Syncs progressor data to server with exponential backoff retry.
 * Debounced to batch rapid changes (e.g., multiple survey answers).
 * Caller must pass `guidesApi` (e.g. from the data store).
 */
export const syncProgressor = (
  progressorData: ProgressorData,
  accountToken: string,
  sessionId: string,
  api: GuidesAndSurveysApi | null,
  userId?: string,
  debounceMs: number = 100
): void => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    if (!api) {
      return;
    }
    const success = await withRetry(() =>
      api.saveProgressor(accountToken, sessionId, progressorData, userId)
    );
    if (!success) {
      // TODO: send error to analytics
    }
  }, debounceMs);
};
