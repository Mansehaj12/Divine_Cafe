/**
 * Divine Cafe - Simple Order Service
 * Minimal order utility — orders go via WhatsApp message to the owner.
 * No cloud relay, no kitchen dashboard, no multi-device sync needed.
 */

// Audio bell kept minimal for optional future use
let globalAudioCtx = null;

export function initMobileAudio() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
      globalAudioCtx = new AudioContextClass();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
    return globalAudioCtx;
  } catch (e) {
    return null;
  }
}
