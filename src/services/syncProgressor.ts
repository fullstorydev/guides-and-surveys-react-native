import { saveProgressor } from './api';
import type { ProgressorData } from '../types';

// Debounce timer to batch rapid changes
let debounceTimer: NodeJS.Timeout | null = null;

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

  // Schedule sync after debounce delay
  debounceTimer = setTimeout(async () => {
    const maxRetries = 5;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      attempt++;

      success = await saveProgressor(accountToken, sessionId, progressorData);

      if (!success && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 16000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!success) {
      // TODO: send error to analytics
    }
  }, debounceMs);
};
