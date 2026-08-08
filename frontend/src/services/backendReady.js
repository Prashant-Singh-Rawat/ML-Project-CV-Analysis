/**
 * backendReady.js — Single-flight backend readiness manager
 *
 * The problem this solves:
 *   If 5 components simultaneously detect the backend is sleeping and each
 *   calls pollUntilHealthy(), that creates 5 separate polling loops all hammering
 *   Render. This wastes bandwidth, confuses Render's rate limiter, and creates
 *   a noisy console.
 *
 * The solution: single-flight / shared promise.
 *   If a readiness check is already in progress, return the SAME promise.
 *   All callers share one polling loop. When the backend becomes ready, all
 *   callers resolve simultaneously.
 *
 * Exported API:
 *   ensureBackendReady(onStageChange?, signal?) → Promise<boolean>
 *   isBackendCurrentlyReady()                  → boolean
 *   resetBackendState()                        → void  (for testing/logout)
 *
 * Stage strings passed to onStageChange:
 *   'connecting' | 'waking' | 'ready' | 'timeout'
 *
 * The onStageChange from the FIRST caller to start the check is used for
 * the shared polling loop. Subsequent callers are notified when the result
 * resolves. To receive UI stages, callers should subscribe via the callback
 * — though only the first caller's callback drives the poll loop stages.
 * This is acceptable because typically only one component is showing a
 * loading indicator at a time.
 */

import { pollUntilHealthy } from './health';

// ── State ──────────────────────────────────────────────────────────────────

/** Shared promise while a readiness check is in flight. null when idle. */
let _readinessPromise = null;

/** True once we have confirmed the backend is healthy in this session. */
let _confirmedHealthy = false;

/** Timestamp of the last confirmed healthy response (ms). */
let _lastHealthyAt = 0;

/**
 * How long a "confirmed healthy" status is trusted without re-checking.
 * 5 minutes: if the backend was healthy 5 min ago, skip the poll.
 * This prevents unnecessary health checks on every feature page navigation.
 */
const HEALTHY_TTL_MS = 5 * 60 * 1000;

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Ensure the backend is ready before performing an operation.
 *
 * If the backend was recently confirmed healthy (within TTL), resolves immediately.
 * If a readiness check is already in-flight, joins the existing check (single-flight).
 * Otherwise, starts a new readiness check.
 *
 * @param {function} [onStageChange] - Optional callback for UI updates.
 *   Called with: 'connecting' | 'waking' | 'ready' | 'timeout'
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel.
 * @returns {Promise<boolean>} Resolves true when backend is ready,
 *   false if warm-up timed out or was cancelled.
 */
export async function ensureBackendReady(onStageChange, signal) {
  // 1. If we confirmed healthy recently, skip the poll entirely.
  if (_confirmedHealthy && Date.now() - _lastHealthyAt < HEALTHY_TTL_MS) {
    onStageChange?.('ready');
    return true;
  }

  // 2. If a check is already in-flight, join it (single-flight).
  if (_readinessPromise) {
    onStageChange?.('connecting');
    const result = await _readinessPromise;
    if (result) onStageChange?.('ready');
    return result;
  }

  // 3. Start a new check.
  onStageChange?.('connecting');
  _readinessPromise = _runHealthCheck(onStageChange, signal);

  try {
    const result = await _readinessPromise;
    if (result) {
      _confirmedHealthy = true;
      _lastHealthyAt = Date.now();
      onStageChange?.('ready');
    }
    return result;
  } finally {
    // Always clear the in-flight promise so the next call can start fresh.
    _readinessPromise = null;
  }
}

/**
 * Check if the backend is currently known to be healthy (within TTL).
 * Safe to call synchronously — does not trigger polling.
 */
export function isBackendCurrentlyReady() {
  return _confirmedHealthy && Date.now() - _lastHealthyAt < HEALTHY_TTL_MS;
}

/**
 * Reset the backend health state.
 * Call this on logout, or in tests to simulate a cold start.
 */
export function resetBackendState() {
  _confirmedHealthy = false;
  _lastHealthyAt = 0;
  _readinessPromise = null;
}

// ── Internal ───────────────────────────────────────────────────────────────

/**
 * Internal: run the health poll. Returns the pollUntilHealthy promise.
 * This is extracted so it can be properly wrapped by the single-flight logic.
 */
async function _runHealthCheck(onStageChange, signal) {
  try {
    return await pollUntilHealthy(onStageChange, signal);
  } catch {
    return false;
  }
}
