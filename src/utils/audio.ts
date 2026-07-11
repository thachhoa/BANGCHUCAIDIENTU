/**
 * Web Audio API Synthesizer for Bé Học Vui
 * Generates instant, delightful sound effects without external file dependencies.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a beautiful, sparkling chime sound (for correct answers or completed tracing)
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      this.playTone(523.25, 0.1, now, 'sine');
      // Note 2: E5 (659.25 Hz)
      this.playTone(659.25, 0.1, now + 0.08, 'sine');
      // Note 3: G5 (783.99 Hz)
      this.playTone(783.99, 0.1, now + 0.16, 'sine');
      // Note 4: C6 (1046.50 Hz)
      this.playTone(1046.50, 0.3, now + 0.24, 'sine');
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }

  // Play a soft bubble pop sound (for taps and clicks)
  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Ignored
    }
  }

  // Play a soft buzzer sound (for incorrect answers)
  playFail() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      // Ignored
    }
  }

  // Helper to play a single clean tone
  private playTone(freq: number, duration: number, startTime: number, type: OscillatorType = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Speak a text using browser Speech Synthesis in Vietnamese
  speakVietnamese(text: string, onStart?: () => void, onEnd?: () => void) {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        return;
      }

      // Cancel current speaking
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.85; // slightly slower, clear for kids
      utterance.pitch = 1.1; // a bit higher and friendlier for kids

      // Try to find standard Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis failed', e);
    }
  }
}

export const sound = new AudioSynthesizer();
