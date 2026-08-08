/**
 * errorClassifier.js — Stage-aware error message classification
 *
 * Maps different error types (network, HTTP status, custom codes)
 * to user-friendly messages. Never exposes stack traces, API keys,
 * internal infrastructure details, or raw error objects to the user.
 *
 * Error categories:
 *   A. Backend sleeping / warming up  → shown before analysis starts
 *   B. Warm-up timeout               → backend never became available
 *   C. User cancelled                → explicit AbortController.abort()
 *   D. Network failure               → no internet / DNS failure
 *   E. CORS failure                  → detected by no response + network error
 *   F. Request timeout               → axios ECONNABORTED during /analyze
 *   G. 400 Bad Request               → invalid file, empty PDF
 *   H. 401 / 403                     → authentication error
 *   I. 404 Not Found                 → wrong endpoint
 *   J. 408 Timeout                   → server-side PDF parsing timeout
 *   K. 5xx Server Error              → backend crash
 */

/**
 * Classify an axios/fetch error into a user-friendly message string.
 *
 * @param {Error} err - The error from the axios call or analyzeResume service.
 * @returns {string} A user-friendly error message.
 */
export function classifyError(err) {
  // C. User cancelled via AbortController
  if (err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
    return 'Analysis cancelled.';
  }

  // B. Warm-up timeout — backend never became available
  if (err.code === 'WARMUP_TIMEOUT') {
    return (
      "TonyCV's AI server couldn't be reached after 3 minutes. " +
      'This can happen if the free hosting tier is under high load. ' +
      'Your CV is still ready to upload — please try again in a moment.'
    );
  }

  // F. Request timeout during actual /analyze call (ECONNABORTED)
  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return (
      'The analysis is taking longer than expected. ' +
      'Your CV is still selected — click Analyze to retry without re-uploading.'
    );
  }

  // D. No response at all — network failure or CORS (both result in no err.response)
  if (!err.response) {
    // Hint for developers in console
    if (process.env.NODE_ENV === 'development') {
      console.error('[TonyCV] Network/CORS error:', err.message, err);
    }
    return (
      "Cannot connect to the AI server. " +
      'Please check your internet connection and try again.'
    );
  }

  const status = err.response?.status;
  const detail = err.response?.data?.detail;

  // G. 400 Bad Request — file validation failures
  if (status === 400) {
    if (detail?.toLowerCase().includes('pdf')) {
      return 'Invalid file format. Please upload a valid PDF resume (not a DOCX, image, or other file type).';
    }
    if (detail?.toLowerCase().includes('empty') || detail?.toLowerCase().includes('unreadable')) {
      return "Your PDF appears to be empty or unreadable. Please upload a PDF with selectable text (not a scanned image).";
    }
    return detail || 'Invalid request. Please check your file and try again.';
  }

  // J. 408 — server-side PDF parsing timed out
  if (status === 408) {
    return (
      'Resume parsing timed out. Your PDF may be too large or complex. ' +
      'Try compressing it or saving as a simpler PDF.'
    );
  }

  // H. 401 / 403 — auth issues
  if (status === 401) {
    return 'Session expired. Please log in again and retry.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action. Please log in and try again.';
  }

  // I. 404 — wrong endpoint (shouldn't happen in production but good to catch)
  if (status === 404) {
    return 'The analysis service endpoint was not found. Please contact support if this persists.';
  }

  // K. 5xx — backend errors
  if (status >= 500) {
    return (
      'The AI server encountered an internal error. ' +
      'This is usually temporary — please try again in a few seconds. ' +
      (detail ? `(${detail})` : '')
    ).trim();
  }

  // Fallback — use detail from backend if available
  return detail || err.message || 'Analysis failed. Please try again.';
}
