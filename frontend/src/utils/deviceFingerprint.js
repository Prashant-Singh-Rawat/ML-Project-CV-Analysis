/**
 * Device Fingerprinting Utility
 * Generates a SHA-256 hash of browser/device characteristics
 * for single-device account binding.
 */

export const getDeviceFingerprint = async () => {
  const components = [];

  // Core browser identifiers
  components.push(navigator.userAgent || 'unknown-ua');
  components.push(navigator.language || 'unknown-lang');
  components.push(navigator.languages ? navigator.languages.join(',') : '');
  components.push(String(screen.width) + 'x' + String(screen.height));
  components.push(String(screen.availWidth) + 'x' + String(screen.availHeight));
  components.push(String(screen.colorDepth));
  components.push(String(new Date().getTimezoneOffset()));
  components.push(navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : 'unknown');
  components.push(navigator.platform || 'unknown-platform');
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown-tz');
  components.push(String(navigator.maxTouchPoints || 0));
  components.push(String(window.devicePixelRatio || 1));

  // Canvas fingerprint (unique per GPU/font rendering engine)
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('TonyCV-FP:2026', 2, 2);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px Georgia, serif';
    ctx.fillText('Device-Auth-Check', 2, 20);
    components.push(canvas.toDataURL());
  } catch (e) {
    components.push('canvas-blocked');
  }

  // WebGL renderer fingerprint
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch (e) {
    components.push('webgl-blocked');
  }

  // Audio context fingerprint
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gainNode = context.createGain();
      gainNode.gain.value = 0;
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(0);
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(dataArray);
      components.push(dataArray.slice(0, 10).join(','));
      oscillator.stop();
      context.close();
    }
  } catch (e) {
    components.push('audio-blocked');
  }

  // Hash all components together using SHA-256
  const str = components.join('|||');
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback: simple hash if SubtleCrypto not available
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
};
