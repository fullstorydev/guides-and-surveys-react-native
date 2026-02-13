import { saveProgressor } from './api';
import type { ProgressorData } from '../types';
import { withRetry } from '../utils/retry';

// Debounce timer to batch rapid changes
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Syncs progressor data to server with exponential backoff retry.
 * Debounced to batch rapid changes (e.g., multiple survey answers).
 *
 * @param progressorData - Progressor data to save
 * @param accountToken - Guide & Surveys space token
 * @param sessionId - Session ID to save progress for
 * @param debounceMs - Milliseconds to wait after last change before syncing (default: 100ms)
 */
export const syncProgressor = (
  progressorData: ProgressorData,
  accountToken: string,
  sessionId: string,
  debounceMs: number = 100
): void => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    const success = await withRetry(() =>
      saveProgressor(accountToken, sessionId, progressorData)
    );
    if (!success) {
      // TODO: send error to analytics
    }
  }, debounceMs);
};
