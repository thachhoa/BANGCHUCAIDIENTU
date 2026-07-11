import React, { useState, useEffect } from 'react';
import { VIETNAMESE_ALPHABET } from '../data';
import { QuizQuestion } from '../types';
import { sound } from '../utils/audio';
import { Trophy, ArrowRight, Play, Heart, Star, Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

export const EducationalGame: React.FC = () => {
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

  // Generate a random question
  const generateQuestion = (): QuizQuestion => {
    const types: QuizQuestion['type'][] = ['FIND_IMAGE', 'FIND_LETTER', 'LISTEN_FIND', 'SPELL_WORD'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    // Select correct letter data
    // For spelling, we need exampleWord length >= 2
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
        audioText: `Hãy lắng nghe xem đây là chữ gì nhé: ${correctLetter.pronunciation}.`,
        correctAnswer: correctLetter.uppercase,
        options
      };
    } else { // SPELL_WORD
      const targetWord = correctLetter.exampleWord.toLowerCase();
      // Scramble letters
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
    
    const q = generateQuestion();
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

    // Filter clicked letter out from scrambled layout representation
    if (currentQuestion.scrambledLetters) {
      const remaining = [...currentQuestion.scrambledLetters];
      remaining.splice(index, 1);
      setCurrentQuestion({
        ...currentQuestion,
        scrambledLetters: remaining
      });
    }

    // Check if fully spelled
    const target = currentQuestion.correctAnswer;
    if (newSpelled.length === target.length) {
      const spelledWord = newSpelled.join('');
      const isCorrect = spelledWord === target;
      
      setSelectedOption(spelledWord);
      if (isCorrect) {
        sound.playSuccess();
        setAnswerStatus('CORRECT');
        setScore(prev => prev + 15 + (streak * 2)); // Spelling awards slightly higher base score
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

  // Reset spelling area and return letters to tray
  const resetSpelling = () => {
    if (selectedOption || !currentQuestion) return;
    sound.playPop();
    setSpelledLetters([]);
    // Restore letters
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
      
      // Save stats to localStorage for Parent Dashboard
      try {
        const currentHigh = Number(localStorage.getItem('behọcvui_game_highscore') || '0');
        if (score > currentHigh) {
          localStorage.setItem('behọcvui_game_highscore', score.toString());
        }
        const sessions = Number(localStorage.getItem('behọcvui_game_sessions') || '0');
        localStorage.setItem('behọcvui_game_sessions', (sessions + 1).toString());
        
        // Trigger statistics component update
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
    
    const q = generateQuestion();
    setCurrentQuestion(q);

    setTimeout(() => {
      sound.speakVietnamese(q.audioText);
    }, 300);
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
          /* START PLAY SCREEN */
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center text-center py-10"
          >
            <div className="w-24 h-24 rounded-full bg-amber-300 border border-amber-200 flex items-center justify-center text-5xl shadow-md mb-6 animate-bounce">
              🐰
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">Trò Chơi Học Chữ Vui Nhộn</h2>
            <p className="text-sm text-sky-700 max-w-md mb-8 leading-relaxed">
              Bé hãy cùng Thỏ Trí Tuệ vượt qua 10 câu hỏi đố vui để nhận được huy chương Bé Ngoan và tích điểm ngôi sao nhé! Có thêm phần ghép chữ đánh vần cực vui nha!
            </p>
            <button
              onClick={startNewGame}
              className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-lg rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              Bắt đầu Chơi Ngay!
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
                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-sm font-semibold transition-colors animate-pulse"
              >
                Về Trang Chủ
              </button>
              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-amber-950 rounded-2xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
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
            <div className="flex justify-between items-center bg-white/70 border border-sky-100 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="text-xs text-sky-800 font-semibold bg-sky-100 px-3 py-1 rounded-full">
                  Câu {questionCount} / 10
                </span>
                {streak >= 2 && (
                  <span className="text-[10px] text-white font-bold bg-amber-500 px-2 py-0.5 rounded-full animate-bounce flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 fill-white" />
                    Chuỗi x{streak}
                  </span>
                )}
              </div>

              {/* Heart Lives */}
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

              {/* Score Display */}
              <div className="text-right">
                <span className="text-xs text-sky-800 font-semibold">Điểm: </span>
                <span className="text-base font-black text-rose-500">{score}</span>
              </div>
            </div>

            {/* Question description */}
            <div className="text-center mb-6 flex flex-col items-center">
              <h3 className="text-lg md:text-xl font-bold text-sky-900 leading-snug max-w-lg">
                {currentQuestion.questionText}
              </h3>
              
              <button
                onClick={speakQuestionAudio}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-sky-200/50 hover:bg-sky-200 active:bg-sky-300 text-sky-800 text-xs font-semibold rounded-full transition-colors"
              >
                <Icons.Volume2 className="w-4 h-4" />
                Nghe Thỏ Đọc Câu Hỏi
              </button>
            </div>

            {/* Custom Interactive Elements depending on game mode */}
            <div className="flex-1 flex justify-center items-center mb-8">
              {currentQuestion.type === 'FIND_IMAGE' && (
                /* Mode 1: FIND_IMAGE */
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

              {currentQuestion.type === 'FIND_LETTER' && (
                /* Mode 2: FIND_LETTER */
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
                        className={`py-5 px-6 rounded-2xl border-2 text-center text-lg font-bold transition-all shadow-sm ${btnClass}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'LISTEN_FIND' && (
                /* Mode 3: LISTEN_FIND */
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
                        className={`aspect-square rounded-3xl border-2 flex items-center justify-center text-5xl font-black transition-all shadow-sm ${btnClass}`}
                      >
                        {opt.value}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'SPELL_WORD' && (
                /* Mode 4: SPELL_WORD (Spelling board game) */
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
