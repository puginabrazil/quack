/**
 * Web Audio API Duck Quack Sound Synthesizer
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Generates an authentic duck quack sound using formant filtering,
 * pitch drop, and harmonic distortion.
 */
export function playQuack(options?: { pitchMultiplier?: number; volume?: number }) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const basePitch = (280 + Math.random() * 80) * (options?.pitchMultiplier || 1);
    const volume = options?.volume ?? 0.45;
    const duration = 0.22 + Math.random() * 0.08;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(volume, now + 0.025);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Primary oscillator: Sawtooth for rich duck harmonics
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    // Pitch drops sharply like a duck quack: "QUAA-ck"
    osc.frequency.setValueAtTime(basePitch * 1.3, now);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.8, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.65, now + duration);

    // Sub oscillator for nasal body
    const subOsc = ctx.createOscillator();
    subOsc.type = 'square';
    subOsc.frequency.setValueAtTime(basePitch * 1.2, now);
    subOsc.frequency.exponentialRampToValueAtTime(basePitch * 0.6, now + duration);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.35, now);

    // AM Modulator (flutter / raspy throat)
    const modulator = ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(45 + Math.random() * 20, now); // ~50Hz flutter

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.4, now);
    modulator.connect(modGain.gain);

    // Formant 1: Resonant nasal peak (~850 Hz)
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(800 + Math.random() * 200, now);
    filter1.Q.setValueAtTime(4.5, now);

    // Formant 2: Upper nasal peak (~1800 Hz)
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(1700 + Math.random() * 300, now);
    filter2.Q.setValueAtTime(3.8, now);

    // Distortion / saturation for raspy quack timbre
    const waveshaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * 2.2);
    }
    waveshaper.curve = curve;

    // Connections
    osc.connect(filter1);
    subOsc.connect(subGain);
    subGain.connect(filter1);

    osc.connect(filter2);
    subGain.connect(filter2);

    filter1.connect(waveshaper);
    filter2.connect(waveshaper);

    waveshaper.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Start & Stop
    osc.start(now);
    subOsc.start(now);
    modulator.start(now);

    osc.stop(now + duration);
    subOsc.stop(now + duration);
    modulator.stop(now + duration);
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
}

/**
 * Trigger random multiple quacks (like "quack! quack!")
 */
export function playRandomQuackBurst() {
  playQuack({ pitchMultiplier: 0.95 + Math.random() * 0.15 });

  // 35% chance to do a rapid second quack
  if (Math.random() > 0.65) {
    setTimeout(() => {
      playQuack({ pitchMultiplier: 0.88 + Math.random() * 0.2 });
    }, 180 + Math.random() * 120);
  }
}
