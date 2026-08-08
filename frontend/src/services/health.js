/**
 * health.js — Lightweight health polling service for Render cold-start handling
 *
 * Strategy:
 *  1. Poll GET /health with a short per-request timeout (15s).
 *  2. If healthy → resolve immediately.
 *  3. If failed  → wait retryInterval, then retry.
 *  4. Abort after maxWarmupMs total (default 180s).
 *  5. Honour an AbortSignal so callers can cancel (e.g. user navigates away).
 *
 * The CV file is NEVER uploaded during this phase — only a lightweight
 * GET /health is sent, keeping Render bandwidth usage minimal.
 */

import axios from 'axios';

// Dedicated axios instance for health checks.
// Short timeout so we fail fast and retry promptly.
const healthClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8000'
      : 'https://ml-project-cv-analysis.onrender.com'),
  timeout: 15000, // 15 s per health check attempt
});

/**
 * Polling configuration constants.
 * Adjust here to change the overall warm-up behaviour.
 */
const HEALTH_RETRY_INTERVAL_MS = 5000; // Wait 5s between retries
const MAX_WARMUP_MS = 180000; // Give up after 3 minutes total
const MAX_RETRY_INTERVAL_MS = 10000; // Cap backoff at 10s

/**
 * Poll GET /health until the backend responds 200 or we time out.
 *
 * @param {function} onStageChange - Callback to update UI loading stage.
 *   Called with stage string: 'connecting' | 'waking' | 'ready' | 'timeout'
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel polling.
 * @returns {Promise<boolean>} Resolves true when backend is healthy,
 *   false if maxWarmupMs exceeded without a successful response.
 */
export async function pollUntilHealthy(onStageChange, signal) {
  const startedAt = Date.now();
  let attempt = 0;
  let retryInterval = HEALTH_RETRY_INTERVAL_MS;

  // Notify caller we're beginning the connection attempt
  onStageChange?.('connecting');

  while (Date.now() - startedAt < MAX_WARMUP_MS) {
    // Respect abort signal
    if (signal?.aborted) {
      return false;
    }

    attempt += 1;

    try {
      const response = await healthClient.get('/health', {
        signal, // Pass AbortSignal through to axios
      });

      if (response.status === 200 && response.data?.status === 'healthy') {
        onStageChange?.('ready');
        return true;
      }
    } catch (err) {
      // If the signal was aborted, stop immediately
      if (err.name === 'AbortError' || err.name === 'CanceledError' || signal?.aborted) {
        return false;
      }

      // Log for debugging (not to user) — distinguish connection refused vs timeout
      const reason = !err.response
        ? `no_response (${err.code || err.message})`
        : `http_${err.response.status}`;

      console.info(
        `[TonyCV] Health check attempt ${attempt} failed: ${reason}. ` +
          `Elapsed: ${Math.round((Date.now() - startedAt) / 1000)}s. ` +
          `Retrying in ${retryInterval / 1000}s...`
      );

      // Switch to "waking" stage after the first failed attempt
      if (attempt === 1) {
        onStageChange?.('waking');
      }
    }

    // Wait before next retry, respecting abort signal
    const waited = await _sleep(retryInterval, signal);
    if (!waited) return false; // Aborted during sleep

    // Apply bounded exponential backoff: 5s → 10s → 10s → 10s ...
    retryInterval = Math.min(retryInterval * 1.5, MAX_RETRY_INTERVAL_MS);
  }

  // Exhausted warm-up window
  onStageChange?.('timeout');
  return false;
}

/**
 * Quick single-shot health check (no polling).
 * Returns true if backend is already healthy, false otherwise.
 * Use this to show the user an immediate status on page load.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<boolean>}
 */
export async function checkHealth(signal) {
  try {
    const response = await healthClient.get('/health', { signal });
    return response.status === 200 && response.data?.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Sleep for ms milliseconds, aborting early if the signal fires.
 * @returns {Promise<boolean>} true if completed normally, false if aborted.
 */
function _sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }

    const timer = setTimeout(() => resolve(true), ms);

    if (signal) {
      const onAbort = () => {
        clearTimeout(timer);
        resolve(false);
      };
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}
