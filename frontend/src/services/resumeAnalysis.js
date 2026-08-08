/**
 * resumeAnalysis.js — Centralized CV analysis service
 *
 * This module is the single place that orchestrates the full analysis flow:
 *   1. Poll /health until backend is ready (handles Render cold start)
 *   2. POST /analyze EXACTLY ONCE after health is confirmed
 *   3. Never re-upload the CV during the health polling phase
 *
 * Why a dedicated module?
 *   - Prevents duplicate logic across Analyze.jsx and Home.jsx
 *   - Makes the health gate mandatory — impossible to bypass accidentally
 *   - Centralises timeout configuration
 *   - Allows clean cancellation via AbortController
 */

import api from './api';
import { ensureBackendReady } from './backendReady';

// Timeout for the actual /analyze POST request.
// 180s to accommodate: PDF parsing + ML inference + hiring analysis.
// This is intentionally larger than the axios default in api.js
// because /analyze is the expensive operation.
const ANALYZE_TIMEOUT_MS = 180000;

/**
 * Analyse a resume CV with automatic Render cold-start handling.
 *
 * Workflow:
 *   health gate → (backend wakes if needed) → POST /analyze → return data
 *
 * The FormData (including the File object) is held in memory in the caller.
 * It is submitted to /analyze ONLY ONCE, after the backend is confirmed healthy.
 * It is never re-submitted during the health polling loop.
 *
 * @param {FormData} formData  - Must contain 'cv_file' field with a PDF File.
 * @param {function} onStageChange - Callback for UI stage updates.
 *   Stages: 'connecting' | 'waking' | 'ready' | 'parsing' | 'analyzing'
 *           | 'finishing' | 'complete' | 'timeout'
 * @param {AbortSignal} [signal] - Optional signal to cancel the entire flow.
 * @returns {Promise<object>} The analysis result JSON from the backend.
 * @throws {Error} On health timeout, network error, or backend error.
 */
export async function analyzeResume(formData, onStageChange, signal) {
  // ── Phase 1: Health gate ────────────────────────────────────────────────
  // Ensure the backend is ready before sending the CV. Uses single-flight
  // mechanism — if another component is already polling, this joins that poll.
  const isHealthy = await ensureBackendReady(onStageChange, signal);

  if (!isHealthy) {
    if (signal?.aborted) {
      const err = new Error('Analysis cancelled by user.');
      err.code = 'ERR_CANCELED';
      throw err;
    }
    // Warm-up window exhausted — backend still not responding
    const err = new Error(
      "The AI server couldn't be reached after 3 minutes. " +
        'It may be temporarily unavailable. Please try again shortly.'
    );
    err.code = 'WARMUP_TIMEOUT';
    throw err;
  }

  // ── Phase 2: CV Analysis ────────────────────────────────────────────────
  // Backend is confirmed healthy. Submit the CV exactly once.
  onStageChange?.('parsing');

  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: ANALYZE_TIMEOUT_MS,
    signal, // propagate cancellation
  });

  onStageChange?.('finishing');

  // Small yield to allow the UI to render the 'finishing' stage
  await new Promise((r) => setTimeout(r, 400));

  onStageChange?.('complete');
  return response.data;
}
