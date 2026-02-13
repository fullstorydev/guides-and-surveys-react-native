export type RetryOptions<T> = {
  /** Max number of attempts (default: 5). */
  maxRetries?: number;
  /** Delay in ms before the next attempt. Receives 1-based attempt number. Default: exponential 1s, 2s, 4s, 8s, 16s (capped). */
  getDelayMs?: (attempt: number) => number;
  /** Consider result successful; stop retrying when true. Default: (x) => x === true (for boolean returns). */
  isSuccess?: (result: T) => boolean;
};

const defaultGetDelayMs = (attempt: number): number =>
  Math.min(1000 * Math.pow(2, attempt - 1), 16000);

/**
 * Run an async operation with exponential-backoff retry.
 * Retries until isSuccess(result) is true or maxRetries is reached; returns the last result.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions<T> = {}
): Promise<T> {
  const {
    maxRetries = 5,
    getDelayMs = defaultGetDelayMs,
    isSuccess = (x: T) => x === true,
  } = options;

  let last: T;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    last = await fn();
    if (isSuccess(last)) return last;
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, getDelayMs(attempt)));
    }
  }

  return last!;
}
