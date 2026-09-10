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

  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
    }
  }

  private initVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize standard Vietnamese voices
    const viVoices = voices.filter(v => 
      v.lang.toLowerCase().includes('vi') || 
      v.name.toLowerCase().includes('vietnam') || 
      v.name.toLowerCase().includes('tiếng việt')
    );

    if (viVoices.length > 0) {
      // Prefer Google or Microsoft Natural female voices if present
      const best = viVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Natural') || 
        v.name.includes('An') || 
        v.name.includes('Hoai')
      );
      this.preferredVoice = best || viVoices[0];
    }
  }

  // Speak a text using browser Speech Synthesis in Vietnamese with maximum volume & clarity
  speakVietnamese(text: string, onStart?: () => void, onEnd?: () => void) {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        return;
      }

      // Cancel current speaking
      window.speechSynthesis.cancel();

      // Ensure voice is populated
      if (!this.preferredVoice) {
        this.initVoice();
      }

      // If text is extremely short (single word/letter sound), expand slightly for TTS clarity
      let cleanText = text.trim();
      if (cleanText.length <= 2 && !cleanText.includes(' ')) {
        cleanText = `Âm ${cleanText}.`;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.volume = 1.0; // Maximum volume
      utterance.rate = 0.88;  // Clear pace for kids
      utterance.pitch = 1.0; // Natural pitch

      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.toLowerCase().includes('vi'));
        if (viVoice) utterance.voice = viVoice;
      }

      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis failed', e);
    }
  }

  // Speak letter using standard Grade 1 Vietnamese phonic reading (Chữ & Âm)
  speakLetter(letter: { letter: string; uppercase: string; pronunciation: string }, onStart?: () => void, onEnd?: () => void) {
    const letterNames: Record<string, string> = {
      'A': 'A', 'Ă': 'Á', 'Â': 'Ớ', 'B': 'Bê', 'C': 'Xê', 'D': 'Dê', 'Đ': 'Đê',
      'E': 'E', 'Ê': 'Ê', 'G': 'Giê', 'H': 'Hát', 'I': 'I', 'K': 'Ca', 'L': 'En-lờ',
      'M': 'Em-mờ', 'N': 'En-nờ', 'O': 'O', 'Ô': 'Ô', 'Ơ': 'Ơ', 'P': 'Bê-phở',
      'Q': 'Quy', 'R': 'E-rờ', 'S': 'Ét-sờ', 'T': 'Tê', 'U': 'U', 'Ư': 'Ư',
      'V': 'Vê', 'X': 'Ích-xờ', 'Y': 'Y dài'
    };

    const name = letterNames[letter.letter] || letter.uppercase;
    // Format: "Chữ Bê. Phát âm là Bờ."
    const textToSpeak = `Chữ ${name}. Phát âm là ${letter.pronunciation}.`;
    this.speakVietnamese(textToSpeak, onStart, onEnd);
  }
}

export const sound = new AudioSynthesizer();

