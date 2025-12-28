class AudioEngine {
  private context: any = null;
  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.context = new AudioContextClass();
      } catch (e) {}
    }
  }
  init() { if (this.context?.state === 'suspended') this.context.resume(); }
  private playTone(freq: number, type: any, duration: number) {
    if (!this.context) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + duration);
  }
  click() { this.playTone(800, 'sine', 0.05); }
  beep() { this.playTone(1200, 'square', 0.1); }
  buzz() { this.playTone(150, 'sawtooth', 0.3); }
  chaching() { this.playTone(1200, 'sine', 0.2); }
}
export const audioEngine = new AudioEngine();
