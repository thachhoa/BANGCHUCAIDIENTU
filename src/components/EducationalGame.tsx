import React, { useState } from 'react';
import { VIETNAMESE_ALPHABET } from '../data';
import { QuizQuestion, GameMode } from '../types';
import { sound } from '../utils/audio';
import { Trophy, ArrowRight, Play, Heart, Star, Sparkles, Check, X, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

export const EducationalGame: React.FC = () => {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('LETTERS');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [lives, setLives] = useState(3);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [streak, setStreak] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Spell game mode states
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);

  // Helper to dynamically render Lucide icons by name
  const renderIcon = (name: string, colorClass = "text-rose-500") => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className={`w-14 h-14 ${colorClass}`} />;
    }
    return <Icons.HelpCircle className={`w-14 h-14 ${colorClass}`} />;
  };

  // Grade 1 Vietnamese Syllables Combination Pool
  const CONSONANTS = [
    { char: "B", sound: "Bờ" },
    { char: "C", sound: "Cờ" },
    { char: "D", sound: "Dờ" },
    { char: "Đ", sound: "Đờ" },
    { char: "G", sound: "Gờ" },
    { char: "H", sound: "Hờ" },
    { char: "L", sound: "Lờ" },
    { char: "M", sound: "Mờ" },
    { char: "N", sound: "Nờ" },
    { char: "T", sound: "Tờ" },
    { char: "V", sound: "Vờ" },
    { char: "X", sound: "Xờ" }
  ];

  const VOWELS = ["a", "e", "ê", "i", "o", "ô", "ơ", "u", "ư"];

  // Generate a question according to selected game mode
  const generateQuestion = (mode: GameMode = selectedGameMode): QuizQuestion => {
    let types: QuizQuestion['type'][] = [];
    if (mode === 'LETTERS') {
      types = ['FIND_IMAGE', 'FIND_LETTER', 'LISTEN_FIND'];
    } else if (mode === 'SYLLABLES') {
      types = ['SPELL_WORD', 'COMBINE_SOUNDS', 'FIND_SYLLABLE'];
    } else {
      types = ['FIND_IMAGE', 'FIND_LETTER', 'LISTEN_FIND', 'SPELL_WORD', 'COMBINE_SOUNDS', 'FIND_SYLLABLE'];
    }

    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    // Select correct letter data
    let correctIdx = Math.floor(Math.random() * VIETNAMESE_ALPHABET.length);
    let correctLetter = VIETNAMESE_ALPHABET[correctIdx];
    
    if (selectedType === 'SPELL_WORD') {
      let attempts = 0;
      while (correctLetter.exampleWord.length < 2 && attempts < 50) {
        correctIdx = Math.floor(Math.random() * VIETNAMESE_ALPHABET.length);
        correctLetter = VIETNAMESE_ALPHABET[correctIdx];
        attempts++;
      }
    }

    // Generate wrong letters
    const pool = VIETNAMESE_ALPHABET.filter(item => item.letter !== correctLetter.letter);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledPool.slice(0, 3);

    if (selectedType === 'FIND_IMAGE') {
      const options = [
        { value: correctLetter.word, label: correctLetter.word, iconName: correctLetter.iconName },
        ...wrongOptions.slice(0, 2).map(item => ({
          value: item.word,
          label: item.word,
          iconName: item.iconName
        }))
      ].sort(() => 0.5 - Math.random());

      return {
        id: `q-${Date.now()}`,
        type: 'FIND_IMAGE',
        questionText: `Hình nào bắt đầu bằng chữ cái: "${correctLetter.uppercase}" ?`,
        audioText: `Bé hãy tìm hình bắt đầu bằng chữ cái ${correctLetter.uppercase} nhé!`,
        correctAnswer: correctLetter.word,
        options
      };
    } else if (selectedType === 'FIND_LETTER') {
      const options = [
        { value: correctLetter.uppercase, label: `Chữ ${correctLetter.uppercase}` },
        ...wrongOptions.map(item => ({
          value: item.uppercase,
          label: `Chữ ${item.uppercase}`
        }))
      ].sort(() => 0.5 - Math.random());

      return {
        id: `q-${Date.now()}`,
        type: 'FIND_LETTER',
        questionText: `Hình "${correctLetter.word}" tương ứng với chữ cái nào?`,
        audioText: `Hình ${correctLetter.word} tương ứng với chữ cái nào dưới đây hả bé?`,
        correctAnswer: correctLetter.uppercase,
        options
      };
    } else if (selectedType === 'LISTEN_FIND') {
      const options = [
        { value: correctLetter.uppercase, label: correctLetter.uppercase },
        ...wrongOptions.map(item => ({
          value: item.uppercase,
          label: item.uppercase
        }))
      ].sort(() => 0.5 - Math.random());

      return {
        id: `q-${Date.now()}`,
        type: 'LISTEN_FIND',
        questionText: `Nghe phát âm và chọn chữ cái chính xác:`,
        audioText: `Lắng nghe xem đây là chữ gì nhé: Chữ ${correctLetter.uppercase}. Phát âm là ${correctLetter.pronunciation}.`,
        correctAnswer: correctLetter.uppercase,
        options
      };
    } else if (selectedType === 'SPELL_WORD') {
      const targetWord = correctLetter.exampleWord.toLowerCase();
      const scrambledLetters = targetWord.split('').sort(() => 0.5 - Math.random());

      return {
        id: `q-${Date.now()}`,
        type: 'SPELL_WORD',
        questionText: `Bé hãy ghép các mảnh chữ cái để xếp thành từ đúng: "${correctLetter.word}"`,
        audioText: `Bé hãy nhấn chọn các chữ cái bên dưới để xếp thành từ ${correctLetter.exampleWord} nhé!`,
        correctAnswer: targetWord,
        options: [],
        scrambledLetters,
        iconName: correctLetter.iconName
      };
    } else if (selectedType === 'COMBINE_SOUNDS') {
      const cons = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      const vowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      const targetSyllable = (cons.char.toLowerCase() + vowel).toLowerCase();

      const otherCons = CONSONANTS.filter(c => c.char !== cons.char).sort(() => 0.5 - Math.random()).slice(0, 3);
      const wrongSyllables = otherCons.map(c => (c.char.toLowerCase() + vowel).toLowerCase());

      const options = [
        { value: targetSyllable, label: `Tiếng "${targetSyllable.toUpperCase()}"` },
        ...wrongSyllables.map(s => ({ value: s, label: `Tiếng "${s.toUpperCase()}"` }))
      ].sort(() => 0.5 - Math.random());

      return {
        id: `q-${Date.now()}`,
        type: 'COMBINE_SOUNDS',
        questionText: `Âm "${cons.char}" (${cons.sound}) ghép với âm "${vowel.toUpperCase()}" tạo thành tiếng gì?`,
        audioText: `Âm ${cons.sound} ghép với âm ${vowel} tạo thành tiếng gì hả bé?`,
        correctAnswer: targetSyllable,
        options
      };
    } else { // FIND_SYLLABLE
      const cons = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      const vowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      const targetSyllable = (cons.char.toLowerCase() + vowel).toUpperCase();
      const correctAnswerText = `Âm ${cons.sound} (${cons.char}) và âm ${vowel.toUpperCase()}`;

      const otherCons = CONSONANTS.filter(c => c.char !== cons.char).sort(() => 0.5 - Math.random()).slice(0, 3);
      const wrongAnswerTexts = otherCons.map(c => `Âm ${c.sound} (${c.char}) và âm ${vowel.toUpperCase()}`);

      const options = [
        { value: correctAnswerText, label: correctAnswerText },
        ...wrongAnswerTexts.map(text => ({ value: text, label: text }))
      ].sort(() => 0.5 - Math.random());

      return {
        id: `q-${Date.now()}`,
        type: 'FIND_SYLLABLE',
        questionText: `Tiếng "${targetSyllable}" được ghép từ hai âm nào dưới đây?`,
        audioText: `Tiếng ${targetSyllable} được ghép từ hai âm nào hả bé?`,
        correctAnswer: correctAnswerText,
        options
      };
    }
  };

  const startNewGame = () => {
    sound.playPop();
    setScore(0);
    setLives(3);
    setQuestionCount(1);
    setStreak(0);
    setGameFinished(false);
    setSelectedOption(null);
    setAnswerStatus(null);
    setSpelledLetters([]);
    
    const q = generateQuestion(selectedGameMode);
    setCurrentQuestion(q);
    setIsPlaying(true);

    setTimeout(() => {
      sound.speakVietnamese(q.audioText);
    }, 400);
  };

  const speakQuestionAudio = () => {
    if (currentQuestion) {
      sound.playPop();
      sound.speakVietnamese(currentQuestion.audioText);
    }
  };

  const handleSelectOption = (value: string) => {
    if (selectedOption || gameFinished) return;
    
    setSelectedOption(value);
    const isCorrect = value === currentQuestion?.correctAnswer;

    if (isCorrect) {
      sound.playSuccess();
      setAnswerStatus('CORRECT');
      setScore(prev => prev + 10 + (streak * 2));
      setStreak(prev => prev + 1);
      
      const praises = ["Bé giỏi quá!", "Chính xác rồi!", "Hoàn hảo!", "Siêu thế bé ơi!"];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setTimeout(() => {
        sound.speakVietnamese(randomPraise);
      }, 700);
    } else {
      sound.playFail();
      setAnswerStatus('WRONG');
      setLives(prev => prev - 1);
      setStreak(0);
      
      setTimeout(() => {
        sound.speakVietnamese("Sai mất rồi bé ơi, bé thử lại câu tiếp theo nhé!");
      }, 700);
    }
  };

  // Handler for spelling game letter click
  const handleSpellLetterClick = (letterVal: string, index: number) => {
    if (selectedOption || gameFinished || !currentQuestion) return;

    sound.playPop();
    const newSpelled = [...spelledLetters, letterVal];
    setSpelledLetters(newSpelled);

    if (currentQuestion.scrambledLetters) {
      const remaining = [...currentQuestion.scrambledLetters];
      remaining.splice(index, 1);
      setCurrentQuestion({
        ...currentQuestion,
        scrambledLetters: remaining
      });
    }

    const target = currentQuestion.correctAnswer;
    if (newSpelled.length === target.length) {
      const spelledWord = newSpelled.join('');
      const isCorrect = spelledWord === target;
      
      setSelectedOption(spelledWord);
      if (isCorrect) {
        sound.playSuccess();
        setAnswerStatus('CORRECT');
        setScore(prev => prev + 15 + (streak * 2));
        setStreak(prev => prev + 1);
        
        setTimeout(() => {
          sound.speakVietnamese("Bé đánh vần chuẩn xác luôn! Giỏi lắm!");
        }, 700);
      } else {
        sound.playFail();
        setAnswerStatus('WRONG');
        setLives(prev => prev - 1);
        setStreak(0);
        
        setTimeout(() => {
          sound.speakVietnamese(`Sai mất rồi bé ơi! Từ đúng là ${currentQuestion.correctAnswer.toUpperCase()}`);
        }, 700);
      }
    }
  };

  const resetSpelling = () => {
    if (selectedOption || !currentQuestion) return;
    sound.playPop();
    setSpelledLetters([]);
    const target = currentQuestion.correctAnswer;
    setCurrentQuestion({
      ...currentQuestion,
      scrambledLetters: target.split('').sort(() => 0.5 - Math.random())
    });
  };

  const handleNextQuestion = () => {
    sound.playPop();
    if (lives <= 0 || questionCount >= 10) {
      setGameFinished(true);
      
      try {
        const currentHigh = Number(localStorage.getItem('behọcvui_game_highscore') || '0');
        if (score > currentHigh) {
          localStorage.setItem('behọcvui_game_highscore', score.toString());
        }
        const sessions = Number(localStorage.getItem('behọcvui_game_sessions') || '0');
        localStorage.setItem('behọcvui_game_sessions', (sessions + 1).toString());
        
        window.dispatchEvent(new Event('behọcvui_stats_updated'));
      } catch (e) {
        console.error('Failed saving stats to localstorage', e);
      }

      sound.speakVietnamese(`Trò chơi kết thúc rồi! Bé đạt được ${score} điểm. Bé ngoan lắm!`);
      return;
    }

    setSelectedOption(null);
    setAnswerStatus(null);
    setSpelledLetters([]);
    setQuestionCount(prev => prev + 1);
    
    const q = generateQuestion(selectedGameMode);
    setCurrentQuestion(q);

    setTimeout(() => {
      sound.speakVietnamese(q.audioText);
    }, 300);
  };

  const getModeLabel = (mode: GameMode) => {
    if (mode === 'LETTERS') return '🔤 Đố Vui Chữ Cái';
    if (mode === 'SYLLABLES') return '🧩 Đố Vui Ghép Tiếng';
    return '🏆 Đố Vui Tổng Hợp';
  };

  return (
    <div id="edu-game-root" className="w-full bg-gradient-to-b from-sky-100/50 to-pink-100/30 rounded-3xl border border-sky-100 p-6 shadow-inner relative overflow-hidden">
      
      {/* Decorative stars */}
      <div className="absolute top-4 left-4 text-sky-200 pointer-events-none animate-bounce">
        <Star className="w-6 h-6 fill-sky-200" />
      </div>
      <div className="absolute bottom-6 right-6 text-pink-200 pointer-events-none animate-pulse">
        <Star className="w-8 h-8 fill-pink-200" />
      </div>

      <AnimatePresence mode="wait">
        {!isPlaying ? (
          /* START PLAY SCREEN WITH MODE SELECTION */
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center text-center py-6 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-amber-300 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-md mb-4 animate-bounce">
              🐰
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-sky-900 mb-2">Trò Chơi Đố Vui Học Chữ</h2>
            <p className="text-xs md:text-sm text-sky-700 max-w-md mb-6 leading-relaxed">
              Bé hãy chọn phần đố vui bé muốn thử sức cùng Thỏ Trí Tuệ nhé!
            </p>

            {/* Mode Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full mb-6">
              {/* Option 1: Letters */}
              <button
                type="button"
                onClick={() => { sound.playPop(); setSelectedGameMode('LETTERS'); }}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all cursor-pointer shadow-sm ${
                  selectedGameMode === 'LETTERS'
                    ? 'bg-gradient-to-b from-rose-50 to-pink-100 border-rose-400 text-rose-950 scale-102 ring-4 ring-rose-200 shadow-md'
                    : 'bg-white hover:bg-rose-50/50 border-rose-100 text-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl font-black mb-2 shadow-sm">
                  🔤
                </div>
                <h3 className="font-extrabold text-sm mb-1">Đố Vui Chữ Cái</h3>
                <p className="text-[10px] opacity-80 leading-relaxed">
                  Nhận biết 29 chữ cái, nghe âm phát âm và chọn hình tương ứng.
                </p>
                {selectedGameMode === 'LETTERS' && (
                  <span className="mt-2 px-2.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full uppercase">
                    ✓ Đã chọn
                  </span>
                )}
              </button>

              {/* Option 2: Syllables / Sound Combining */}
              <button
                type="button"
                onClick={() => { sound.playPop(); setSelectedGameMode('SYLLABLES'); }}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all cursor-pointer shadow-sm ${
                  selectedGameMode === 'SYLLABLES'
                    ? 'bg-gradient-to-b from-sky-50 to-indigo-100 border-indigo-400 text-indigo-950 scale-102 ring-4 ring-indigo-200 shadow-md'
                    : 'bg-white hover:bg-sky-50/50 border-sky-100 text-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-2xl font-black mb-2 shadow-sm">
                  🧩
                </div>
                <h3 className="font-extrabold text-sm mb-1">Đố Vui Ghép Tiếng</h3>
                <p className="text-[10px] opacity-80 leading-relaxed">
                  Tập ghép các âm thành tiếng (C+A=CA), đánh vần & xếp chữ.
                </p>
                {selectedGameMode === 'SYLLABLES' && (
                  <span className="mt-2 px-2.5 py-0.5 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase">
                    ✓ Đã chọn
                  </span>
                )}
              </button>

              {/* Option 3: Mixed */}
              <button
                type="button"
                onClick={() => { sound.playPop(); setSelectedGameMode('MIXED'); }}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all cursor-pointer shadow-sm ${
                  selectedGameMode === 'MIXED'
                    ? 'bg-gradient-to-b from-emerald-50 to-teal-100 border-teal-400 text-teal-950 scale-102 ring-4 ring-teal-200 shadow-md'
                    : 'bg-white hover:bg-emerald-50/50 border-emerald-100 text-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-2xl font-black mb-2 shadow-sm">
                  🏆
                </div>
                <h3 className="font-extrabold text-sm mb-1">Đố Vui Tổng Hợp</h3>
                <p className="text-[10px] opacity-80 leading-relaxed">
                  Thử thách 10 câu đố ngẫu nhiên kết hợp tất cả các dạng.
                </p>
                {selectedGameMode === 'MIXED' && (
                  <span className="mt-2 px-2.5 py-0.5 bg-teal-500 text-white text-[9px] font-black rounded-full uppercase">
                    ✓ Đã chọn
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={startNewGame}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              Bắt Đầu Chơi Ngay!
            </button>
          </motion.div>
        ) : gameFinished || lives <= 0 ? (
          /* GAME END SCREEN */
          <motion.div 
            key="game-over-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-yellow-400 border border-yellow-300 flex items-center justify-center text-amber-950 mb-6 shadow-md shadow-yellow-200">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-amber-950 mb-2">Đại Hội Hoàn Thành!</h2>
            <p className="text-xs text-amber-800 max-w-sm mb-4 leading-relaxed font-semibold">
              Chế độ: {getModeLabel(selectedGameMode)}
            </p>
            <p className="text-sm text-amber-800 max-w-sm mb-6 leading-relaxed">
              Bé đã vượt qua thử thách của Thỏ Trí Tuệ một cách siêu giỏi luôn! 
            </p>

            {/* Scorecard bento */}
            <div className="bg-white/80 border border-amber-200 rounded-2xl p-6 w-full max-w-xs mb-8 flex flex-col items-center gap-2 shadow-sm">
              <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Tổng Điểm Bé Đạt:</span>
              <span className="text-5xl font-black text-rose-500 tracking-tight">{score}</span>
              <div className="flex gap-1 items-center text-yellow-500 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsPlaying(false)}
                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Về Màn Chọn Chế Độ
              </button>
              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-amber-950 rounded-2xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                Chơi Lại Nhé 🐰
              </button>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE GAMEPLAY SCREEN */
          <motion.div 
            key="gameplay-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            {/* Top Stats Banner */}
            <div className="flex justify-between items-center bg-white/80 border border-sky-100 rounded-2xl p-3.5 mb-6 shadow-sm flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-sky-900 font-bold bg-sky-100 px-3 py-1 rounded-full">
                  Câu {questionCount} / 10
                </span>
                <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Layers className="w-3 h-3 text-indigo-500" />
                  {getModeLabel(selectedGameMode)}
                </span>
                {streak >= 2 && (
                  <span className="text-[10px] text-white font-bold bg-amber-500 px-2 py-0.5 rounded-full animate-bounce flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 fill-white" />
                    Chuỗi x{streak}
                  </span>
                )}
              </div>

              {/* Heart Lives & Score */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((heart) => (
                    <Heart 
                      key={heart} 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        heart <= lives 
                          ? 'text-rose-500 fill-rose-500 scale-100' 
                          : 'text-gray-300 scale-90'
                      }`} 
                    />
                  ))}
                </div>

                <div className="text-right">
                  <span className="text-xs text-sky-800 font-semibold">Điểm: </span>
                  <span className="text-base font-black text-rose-500">{score}</span>
                </div>
              </div>
            </div>

            {/* Question description */}
            <div className="text-center mb-6 flex flex-col items-center">
              <h3 className="text-lg md:text-xl font-bold text-sky-900 leading-snug max-w-lg">
                {currentQuestion?.questionText}
              </h3>
              
              <button
                onClick={speakQuestionAudio}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-sky-200/50 hover:bg-sky-200 active:bg-sky-300 text-sky-800 text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                <Icons.Volume2 className="w-4 h-4" />
                Nghe Thỏ Đọc Câu Hỏi
              </button>
            </div>

            {/* Custom Interactive Elements depending on question type */}
            <div className="flex-1 flex justify-center items-center mb-8">
              {currentQuestion?.type === 'FIND_IMAGE' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.value;
                    const isCorrect = opt.value === currentQuestion.correctAnswer;
                    
                    let cardBorderClass = "border-sky-200 hover:border-sky-300 hover:bg-sky-50 bg-white";
                    let checkMark = null;

                    if (selectedOption) {
                      if (isCorrect) {
                        cardBorderClass = "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-[0_0_12px_rgba(52,211,153,0.2)]";
                        checkMark = <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>;
                      } else if (isSelected) {
                        cardBorderClass = "border-rose-400 bg-rose-50 text-rose-800";
                        checkMark = <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center"><X className="w-3.5 h-3.5 stroke-[3]" /></div>;
                      } else {
                        cardBorderClass = "opacity-50 bg-white border-gray-100";
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        disabled={!!selectedOption}
                        className={`relative aspect-square rounded-2xl border-2 p-4 flex flex-col justify-center items-center gap-3 transition-all cursor-pointer shadow-sm ${cardBorderClass}`}
                      >
                        {checkMark}
                        {opt.iconName && renderIcon(opt.iconName)}
                        <span className="text-sm font-bold tracking-tight">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'FIND_LETTER' && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.value;
                    const isCorrect = opt.value === currentQuestion.correctAnswer;
                    
                    let btnClass = "bg-white hover:bg-sky-50 border-sky-200 hover:border-sky-300 text-sky-900";

                    if (selectedOption) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500 hover:bg-emerald-500 text-white border-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        btnClass = "bg-rose-500 hover:bg-rose-500 text-white border-rose-600";
                      } else {
                        btnClass = "opacity-40 bg-white border-gray-100 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        disabled={!!selectedOption}
                        className={`py-5 px-6 rounded-2xl border-2 text-center text-lg font-bold transition-all shadow-sm cursor-pointer ${btnClass}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'LISTEN_FIND' && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.value;
                    const isCorrect = opt.value === currentQuestion.correctAnswer;

                    let btnClass = "bg-white hover:bg-pink-50 border-pink-100 hover:border-pink-200 text-pink-900";

                    if (selectedOption) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500 text-white border-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        btnClass = "bg-rose-500 text-white border-rose-600";
                      } else {
                        btnClass = "opacity-40 bg-white border-gray-100 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        disabled={!!selectedOption}
                        className={`aspect-square rounded-3xl border-2 flex items-center justify-center text-5xl font-black transition-all shadow-sm cursor-pointer ${btnClass}`}
                      >
                        {opt.value}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'COMBINE_SOUNDS' && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.value;
                    const isCorrect = opt.value === currentQuestion.correctAnswer;

                    let btnClass = "bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300 text-indigo-950";

                    if (selectedOption) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500 text-white border-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        btnClass = "bg-rose-500 text-white border-rose-600";
                      } else {
                        btnClass = "opacity-40 bg-white border-gray-100 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        disabled={!!selectedOption}
                        className={`py-5 px-6 rounded-2xl border-2 text-center text-xl font-black tracking-wide transition-all shadow-sm cursor-pointer ${btnClass}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'FIND_SYLLABLE' && (
                <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.value;
                    const isCorrect = opt.value === currentQuestion.correctAnswer;

                    let btnClass = "bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-950";

                    if (selectedOption) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500 text-white border-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        btnClass = "bg-rose-500 text-white border-rose-600";
                      } else {
                        btnClass = "opacity-40 bg-white border-gray-100 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        disabled={!!selectedOption}
                        className={`py-3.5 px-5 rounded-2xl border-2 text-center text-sm font-bold transition-all shadow-sm cursor-pointer ${btnClass}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'SPELL_WORD' && (
                <div className="flex flex-col items-center gap-6 w-full max-w-md bg-white/70 border border-sky-100 rounded-3xl p-5 shadow-sm">
                  {/* Big illustration icon */}
                  <div className="p-4 bg-sky-100/50 rounded-2xl border border-sky-200 shadow-inner">
                    {currentQuestion.iconName && renderIcon(currentQuestion.iconName)}
                  </div>

                  {/* Spelled text boxes layout slots */}
                  <div className="flex gap-2 justify-center items-center h-12 w-full">
                    {currentQuestion.correctAnswer.split('').map((char, index) => {
                      const value = spelledLetters[index];
                      return (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl font-bold uppercase shadow-sm transition-all duration-300 ${
                            value 
                              ? 'bg-rose-500 text-white border-rose-600 scale-100' 
                              : 'bg-slate-100/50 text-transparent border-dashed border-slate-300 scale-90'
                          }`}
                        >
                          {value || ''}
                        </div>
                      );
                    })}

                    {/* Reset spelling button */}
                    {!selectedOption && spelledLetters.length > 0 && (
                      <button
                        onClick={resetSpelling}
                        className="ml-2 p-2 hover:bg-rose-50 rounded-xl text-rose-500 border border-rose-100 shadow-xs cursor-pointer transition-colors"
                        title="Xếp lại"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Scrambled letters tray selection */}
                  {!selectedOption && currentQuestion.scrambledLetters && (
                    <div className="flex flex-wrap gap-3 justify-center items-center border-t border-slate-100 pt-4 w-full">
                      {currentQuestion.scrambledLetters.map((char, index) => (
                        <button
                          key={index}
                          onClick={() => handleSpellLetterClick(char, index)}
                          className="w-11 h-11 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm transition-all uppercase"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Show answer status feedback inside card if spelled */}
                  {selectedOption && (
                    <div className="flex items-center gap-1.5 font-bold mt-2">
                      <span className="text-xs text-slate-400">Đáp án của bé:</span>
                      <span className={`text-sm px-3 py-1 rounded-xl uppercase text-white font-black ${
                        answerStatus === 'CORRECT' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}>
                        {selectedOption}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer feedback status */}
            <AnimatePresence>
              {answerStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center mt-2"
                >
                  <p className={`text-base font-bold mb-4 flex items-center gap-1.5 ${
                    answerStatus === 'CORRECT' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {answerStatus === 'CORRECT' ? (
                      <>✨ Bé giỏi quá! Hoàn toàn chính xác! ✨</>
                    ) : (
                      <>😢 Tiếc quá! Con sai một tí rồi, cùng xem đáp án nhé!</>
                    )}
                  </p>

                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:translate-x-1 active:scale-95 cursor-pointer"
                  >
                    {lives <= 0 || questionCount >= 10 ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

