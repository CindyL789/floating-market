// Atmospheric procedural Web Audio synthesizer for Floating Night-Market
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private windOsc: OscillatorNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private isAmbientRunning: boolean = false;
  private flightWindOscillator: OscillatorNode | null = null;
  private flightStormOscillator: OscillatorNode | null = null;
  private flightWindGain: GainNode | null = null;
  private flightStormGain: GainNode | null = null;
  private flightWindPanner: StereoPannerNode | null = null;
  private flightStormPanner: StereoPannerNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.5, this.ctx.currentTime);
    }
  }

  public startAtmosphericAmbience() {
    if (this.isAmbientRunning || this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Pink noise / wind generator using audio buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04; // subtle volume
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'lowpass';
      this.windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      whiteNoise.connect(this.windFilter);
      this.windFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      whiteNoise.start(0);
      this.isAmbientRunning = true;
    } catch {
      // Audio context may require user gesture
    }
  }

  // Update directional flight audio. Values are normalized in the renderer.
  public updateFlightSpatialAudio(windIntensity: number, stormIntensity: number, pan: number) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      if (!this.flightWindOscillator || !this.flightStormOscillator || !this.flightWindGain || !this.flightStormGain || !this.flightWindPanner || !this.flightStormPanner) {
        this.flightWindOscillator = this.ctx.createOscillator();
        this.flightWindOscillator.type = 'triangle';
        this.flightWindOscillator.frequency.setValueAtTime(118, this.ctx.currentTime);
        this.flightWindGain = this.ctx.createGain();
        this.flightWindGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.flightWindPanner = this.ctx.createStereoPanner();
        this.flightWindOscillator.connect(this.flightWindGain).connect(this.flightWindPanner).connect(this.masterGain);
        this.flightWindOscillator.start();

        this.flightStormOscillator = this.ctx.createOscillator();
        this.flightStormOscillator.type = 'sawtooth';
        this.flightStormOscillator.frequency.setValueAtTime(46, this.ctx.currentTime);
        this.flightStormGain = this.ctx.createGain();
        this.flightStormGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.flightStormPanner = this.ctx.createStereoPanner();
        this.flightStormOscillator.connect(this.flightStormGain).connect(this.flightStormPanner).connect(this.masterGain);
        this.flightStormOscillator.start();
      }

      const now = this.ctx.currentTime;
      const safePan = Math.max(-1, Math.min(1, pan));
      this.flightWindPanner.pan.setTargetAtTime(safePan, now, 0.08);
      this.flightStormPanner.pan.setTargetAtTime(-safePan * 0.85, now, 0.08);
      this.flightWindGain.gain.setTargetAtTime(0.012 + windIntensity * 0.055, now, 0.12);
      this.flightStormGain.gain.setTargetAtTime(stormIntensity * 0.11, now, 0.16);
      this.flightWindOscillator.frequency.setTargetAtTime(108 + windIntensity * 52, now, 0.14);
      this.flightStormOscillator.frequency.setTargetAtTime(42 + stormIntensity * 24, now, 0.18);
    } catch {
      // Spatial audio is an enhancement; browsers may block it before a gesture.
    }
  }

  public disposeFlightSpatialAudio() {
    try {
      this.flightWindOscillator?.stop();
      this.flightStormOscillator?.stop();
    } catch {
      // Oscillators may already be stopped.
    }
    this.flightWindOscillator?.disconnect();
    this.flightStormOscillator?.disconnect();
    this.flightWindGain?.disconnect();
    this.flightStormGain?.disconnect();
    this.flightWindPanner?.disconnect();
    this.flightStormPanner?.disconnect();
    this.flightWindOscillator = null;
    this.flightStormOscillator = null;
    this.flightWindGain = null;
    this.flightStormGain = null;
    this.flightWindPanner = null;
    this.flightStormPanner = null;
  }

  public playPowerUp(type: 'wind_glider' | 'grapple_charge' | 'shock_cell' | 'hull_patch') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const base = type === 'wind_glider' ? 420 : type === 'grapple_charge' ? 300 : type === 'shock_cell' ? 180 : 520;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type === 'hull_patch' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(base, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(base * 1.8, this.ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  public playGrappleLaunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.32);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.42);
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.44);
  }

  public playShockPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(72, this.ctx.currentTime + 0.38);
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.48);
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playEnemyPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(48, this.ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.32);
  }

  // Play a shimmering moon-koi chime (pentatonic scale)
  public playMoonChime(freq: number = 440) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    // Subtle vibrato
    osc.frequency.exponentialRampToValueAtTime(freq * 1.02, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Droplet collect sound (high resonant water droplet)
  public playCollectDroplet() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const baseFreq = 880 + Math.random() * 440;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Brass token / favor clinking sound
  public playBrassClink() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freqs = [1200, 1850, 2400];
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.03);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25 + idx * 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + idx * 0.03);
      osc.stop(this.ctx.currentTime + 0.3 + idx * 0.03);
    });
  }

  // Lantern ignition / mode switch hum
  public playLanternIgnite(mode: 'beacon' | 'signal' | 'ward') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const targetFreq = mode === 'beacon' ? 520 : mode === 'signal' ? 660 : 380;
    osc.type = mode === 'ward' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // Thunder rumble / storm hazard surge
  public playThunderRumble() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.4);
  }

  // Docking bell / temple gong
  public playTempleGong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(330, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 2.5);
    osc2.stop(this.ctx.currentTime + 2.5);
  }

  // Dice roll / talisman rattle
  public playDiceRoll() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + i * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 300, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.06);
    }
  }

  // Celestial attunement / skill unlocked chime (ascending harmonious arpeggio)
  public playAttunementChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major 9th arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const time = this.ctx!.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, time + 0.8);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time);
      osc.stop(time + 1.2);
    });
  }

  // Respec / energy re-attunement whoosh
  public playRespecWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.7);
  }
}

export const sound = new SoundEngine();
