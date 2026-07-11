export interface LetterData {
  letter: string;          // e.g. "A", "Ă", "Â", "B"
  uppercase: string;       // "A"
  lowercase: string;       // "a"
  word: string;            // e.g. "Cái Ca"
  phoneticWord: string;    // phonetic representation for teaching, e.g., "Cái Ca (c-ai-cai-sắc-cái c-a)"
  pronunciation: string;   // phonic pronunciation spelling, e.g., "A", "Bờ", "Cờ", "Dờ", "Đờ"
  exampleWord: string;     // standard example word, e.g. "ca"
  iconName: string;        // Lucide icon key
  color: string;           // Pastel background class (e.g. "bg-pink-100 border-pink-300 text-pink-700")
  badgeColor: string;      // Pastel badge color class
  textAccentColor: string; // Matching deep text accent
  desc: string;            // Fun description for the kid
  tracingPoints: string[]; // SVG path coordinates or guides for simulated drawing tracing
}

export interface QuizQuestion {
  id: string;
  type: 'FIND_IMAGE' | 'FIND_LETTER' | 'LISTEN_FIND' | 'SPELL_WORD';
  questionText: string;
  audioText: string;       // TTS text
  correctAnswer: string;   // Letter or word depending on type
  options: {
    value: string;         // Option content
    label?: string;        // Optional label
    iconName?: string;     // For illustration options
  }[];
  scrambledLetters?: string[]; // For spelling game mode
  iconName?: string;           // For spelling illustration
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
