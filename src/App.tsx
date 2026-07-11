import { useState, useEffect } from 'react';
import { VIETNAMESE_ALPHABET } from './data';
import { LetterData } from './types';
import { CursivePaper } from './components/CursivePaper';
import { BlackboardTracing } from './components/BlackboardTracing';
import { EducationalGame } from './components/EducationalGame';
import { AITutorChat } from './components/AITutorChat';
import { ParentDashboard } from './components/ParentDashboard';
import { sound } from './utils/audio';
import { geminiSettings, generateLetterPoem, generateLessonPlanStructure, getStaticFallbackPoem } from './utils/geminiClient';
import { exportWordLessonPlan, exportPowerPointPresentation } from './utils/documentExporter';
import { 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Trophy, 
  MessageSquare, 
  HelpCircle,
  Smile,
  CheckCircle,
  Settings,
  Key,
  BarChart3,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'trace' | 'game' | 'chat' | 'dashboard'>('learn');
  const [selectedLetter, setSelectedLetter] = useState<LetterData>(VIETNAMESE_ALPHABET[0]);
  const [poem, setPoem] = useState<string>('');
  const [isLoadingPoem, setIsLoadingPoem] = useState<boolean>(false);
  const [isPlayingPoem, setIsPlayingPoem] = useState<boolean>(false);

  // Settings states
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(!geminiSettings.hasKey());
  const [apiKeyInput, setApiKeyInput] = useState<string>(geminiSettings.getApiKey());
  const [selectedModelInput, setSelectedModelInput] = useState<string>(geminiSettings.getModel());

  // Document generating states
  const [isGeneratingDoc, setIsGeneratingDoc] = useState<boolean>(false);

  // Auto check for API Key on load
  useEffect(() => {
    const hasKey = geminiSettings.hasKey();
    if (!hasKey) {
      setIsSettingsOpen(true);
    }
  }, []);

  // Listen to open-gemini-settings event from child components
  useEffect(() => {
    const handleOpenSettings = () => {
      setApiKeyInput(geminiSettings.getApiKey());
      setSelectedModelInput(geminiSettings.getModel());
      setIsSettingsOpen(true);
    };
    window.addEventListener('open-gemini-settings', handleOpenSettings);
    return () => window.removeEventListener('open-gemini-settings', handleOpenSettings);
  }, []);

  // Read aloud helper for letter click
  const selectAndPronounce = (letter: LetterData) => {
    sound.playPop();
    setSelectedLetter(letter);
    sound.speakVietnamese(letter.pronunciation);

    // Save viewed letter progress to localStorage
    try {
      const viewed = JSON.parse(localStorage.getItem('behọcvui_viewed_letters') || '[]');
      if (!viewed.includes(letter.letter)) {
        viewed.push(letter.letter);
        localStorage.setItem('behọcvui_viewed_letters', JSON.stringify(viewed));
        // Dispatch stats updated event
        window.dispatchEvent(new Event('behọcvui_stats_updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Play word illustration speech
  const speakWord = (letter: LetterData) => {
    sound.playPop();
    sound.speakVietnamese(`${letter.word}. ${letter.desc}`);
  };

  // Trigger generator to load custom AI poem for the selected letter
  const loadLetterPoem = async (letter: LetterData) => {
    setIsLoadingPoem(true);
    setPoem('');

    if (!geminiSettings.hasKey()) {
      // Use pre-written high-quality Vietnamese educational poem if API key is not configured
      setPoem(getStaticFallbackPoem(letter.letter));
      setIsLoadingPoem(false);
      return;
    }

    try {
      const aiPoemText = await generateLetterPoem(letter.letter, letter.word);
      setPoem(aiPoemText);
    } catch (e) {
      console.warn("API poem generation failed, using static fallback:", e);
      setPoem(getStaticFallbackPoem(letter.letter));
    } finally {
      setIsLoadingPoem(false);
    }
  };

  // Read out loud the AI poem
  const speakPoemText = () => {
    if (!poem) return;
    sound.playPop();
    setIsPlayingPoem(true);
    sound.speakVietnamese(
      poem,
      () => {},
      () => setIsPlayingPoem(false)
    );
  };

  // Fetch poem whenever letter changes in "learn" mode
  useEffect(() => {
    if (activeTab === 'learn') {
      loadLetterPoem(selectedLetter);
    }
  }, [selectedLetter, activeTab]);

  // Dynamically retrieve Lucide icons for the illustration card
  const renderIllustrationIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-16 h-16 text-rose-500 hover:scale-110 transition-transform" />;
    }
    return <HelpCircle className="w-16 h-16 text-gray-400" />;
  };

  // Save Settings from settings modal
  const saveSettings = () => {
    sound.playSuccess();
    geminiSettings.setApiKey(apiKeyInput);
    geminiSettings.setModel(selectedModelInput);
    setIsSettingsOpen(false);
    // Notify all components that API settings updated
    window.dispatchEvent(new Event('gemini-settings-updated'));
  };

  // Handle Lesson Plan DOCX Generation
  const handleDownloadDocx = async () => {
    sound.playPop();
    setIsGeneratingDoc(true);
    
    let customAiPlan = '';
    
    // Attempt to call Gemini API to write a tailored teaching lesson plan if API Key is configured
    if (geminiSettings.hasKey()) {
      try {
        customAiPlan = await generateLessonPlanStructure(selectedLetter.letter, selectedLetter.word);
      } catch (e) {
        console.warn("AI lesson plan generation failed, exporting standard template instead", e);
      }
    }

    // Call document exporter to save file
    await exportWordLessonPlan(selectedLetter.letter, selectedLetter.word, customAiPlan);
    setIsGeneratingDoc(false);
  };

  // Handle Slide PPTX Generation
  const handleDownloadPptx = async () => {
    sound.playPop();
    // PPTX uses client-side predefined shapes and metadata so it compiles instantly without AI calls
    await exportPowerPointPresentation(
      selectedLetter.letter,
      selectedLetter.word,
      selectedLetter.phoneticWord,
      selectedLetter.desc
    );
  };

  return (
    <div id="main-container" className="min-h-screen bg-[#fffdf6] text-gray-800 flex flex-col selection:bg-pink-200">
      
      {/* Decorative cloud background effects */}
      <div className="absolute top-10 left-10 w-24 h-8 bg-white/60 rounded-full blur-sm pointer-events-none animate-pulse"></div>
      <div className="absolute top-24 right-20 w-32 h-10 bg-white/60 rounded-full blur-sm pointer-events-none animate-pulse"></div>

      {/* HEADER SECTION */}
      <header className="bg-white border-b border-amber-100 py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-4">
          
          {/* Logo & title branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { sound.playPop(); setActiveTab('learn'); }}>
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center text-2xl shadow-md transform rotate-3 hover:rotate-0 transition-all duration-300">
              🎈
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-505 to-amber-600">
                BÉ HỌC VUI
              </h1>
              <p className="text-[10px] md:text-xs text-amber-700/80 font-bold uppercase tracking-wider">
                Bảng Chữ Cái Điện Tử Tiếng Việt
              </p>
            </div>
          </div>

          {/* Settings & Status Control Bar */}
          <div className="flex items-center gap-3">
            {/* Always display red key warning label in header per AI_INSTRUCTIONS.md */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              Lấy API key để sử dụng app
            </span>
            
            <button
              onClick={() => { sound.playPop(); setIsSettingsOpen(true); }}
              className="p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 rounded-2xl transition-colors cursor-pointer flex items-center justify-center shadow-sm"
              title="Cấu hình API Key & Model"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS (5 tabs including Dashboard) */}
      <nav className="bg-amber-50/40 border-b border-amber-100 py-3.5 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 sm:grid-cols-5 gap-2">
          
          {/* Tab 1: Learn */}
          <button
            onClick={() => { sound.playPop(); setActiveTab('learn'); }}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white scale-102 ring-2 ring-rose-200'
                : 'bg-white hover:bg-amber-50/50 text-gray-700 border border-amber-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Bảng Chữ Cái
          </button>

          {/* Tab 2: Trace */}
          <button
            onClick={() => { sound.playPop(); setActiveTab('trace'); }}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'trace'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white scale-102 ring-2 ring-emerald-200'
                : 'bg-white hover:bg-amber-50/50 text-gray-700 border border-amber-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Tập Viết Bảng
          </button>

          {/* Tab 3: Game */}
          <button
            onClick={() => { sound.playPop(); setActiveTab('game'); }}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white scale-102 ring-2 ring-sky-200'
                : 'bg-white hover:bg-amber-50/50 text-gray-700 border border-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Đố Vui Học Chữ
          </button>

          {/* Tab 4: AI Chat */}
          <button
            onClick={() => { sound.playPop(); setActiveTab('chat'); }}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white scale-102 ring-2 ring-amber-200'
                : 'bg-white hover:bg-amber-50/50 text-gray-700 border border-amber-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Trò Chuyện AI
          </button>

          {/* Tab 5: Parent Dashboard */}
          <button
            onClick={() => { sound.playPop(); setActiveTab('dashboard'); }}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer col-span-3 sm:col-span-1 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white scale-102 ring-2 ring-indigo-200'
                : 'bg-white hover:bg-amber-50/50 text-gray-700 border border-amber-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Bảng Thống Kê
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: LEARN MODE */}
          {activeTab === 'learn' && (
            <motion.div
              key="learn-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Letter grid */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white border border-amber-100/60 rounded-3xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                      🎒 Học 29 Chữ Cái
                    </h2>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Nhấn vào chữ cái để nghe phát âm!
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {VIETNAMESE_ALPHABET.map((item) => {
                      const isSelected = selectedLetter.letter === item.letter;
                      return (
                        <button
                          key={item.letter}
                          onClick={() => selectAndPronounce(item)}
                          className={`aspect-square rounded-2xl border-2 p-1.5 flex flex-col justify-between items-center transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-gradient-to-b from-rose-100 to-pink-50 border-rose-400 text-rose-800 scale-105 shadow-md shadow-rose-100'
                              : `${item.color} border-slate-100`
                          }`}
                        >
                          <span className="text-3xl font-black tracking-tight">{item.uppercase}</span>
                          <span className={`text-sm px-2 py-0.5 rounded-full font-handwriting font-bold shadow-sm ${
                            isSelected ? 'bg-rose-500 text-white' : item.badgeColor
                          }`}>
                            {item.lowercase}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Details Panel */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Visual Association and TTS card */}
                <div className="bg-white border border-amber-100/60 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                  
                  {/* Selected Letter showcase */}
                  <div className="flex gap-4 items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 font-black text-4xl shadow-sm border border-rose-200">
                      {selectedLetter.uppercase}
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-handwriting font-semibold text-5xl shadow-sm border border-amber-200">
                      {selectedLetter.lowercase}
                    </div>
                  </div>

                  {/* Play audio sounds button */}
                  <div className="flex gap-3 mb-6 w-full max-w-xs">
                    <button
                      onClick={() => selectAndPronounce(selectedLetter)}
                      className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      Nghe Chữ
                    </button>
                    <button
                      onClick={() => speakWord(selectedLetter)}
                      className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Smile className="w-4 h-4" />
                      Từ Minh Họa
                    </button>
                  </div>

                  {/* Illustration panel */}
                  <div className="bg-[#fffbf0] border border-amber-100 rounded-2xl p-4 w-full flex items-center gap-5 text-left mb-6 relative">
                    <div className="bg-white p-3 rounded-xl border border-amber-50 shadow-inner flex-shrink-0">
                      {renderIllustrationIcon(selectedLetter.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 font-extrabold uppercase tracking-widest">Từ Ví Dụ:</span>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight mb-1">
                        {selectedLetter.word}
                      </h3>
                      <p className="text-[11px] text-gray-500 italic">
                        Đánh vần: {selectedLetter.phoneticWord}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed max-w-sm mb-4">
                    {selectedLetter.desc}
                  </p>

                  {/* Notebook cursive paper display */}
                  <CursivePaper letter={selectedLetter} />
                </div>

                {/* Pedagogical Document Downloader Exporters Card */}
                <div className="bg-white border border-sky-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                    🎓 Tài Liệu Cho Giáo Viên & Ba Mẹ
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tải xuống Giáo án Word hoặc Slide Bài giảng PowerPoint rèn luyện chữ cái này cho bé.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <button
                      onClick={handleDownloadDocx}
                      disabled={isGeneratingDoc}
                      className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
                    >
                      {isGeneratingDoc ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        'Tải Giáo Án (Word)'
                      )}
                    </button>
                    <button
                      onClick={handleDownloadPptx}
                      className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
                    >
                      Tải Slide (PowerPoint)
                    </button>
                  </div>
                </div>

                {/* Custom AI generated Poem panel */}
                <div className="bg-gradient-to-r from-rose-50 to-amber-50/50 border border-amber-100/50 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-rose-200 opacity-40">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  
                  <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-1.5">
                    📖 Thơ Học Chữ Bé Thích (AI)
                  </h3>

                  {isLoadingPoem ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                      <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-semibold text-rose-600">Thỏ đang ngẫm nghĩ bài thơ...</span>
                    </div>
                  ) : (
                    <div className="bg-white/80 border border-amber-100 rounded-2xl p-4 flex flex-col gap-4 shadow-inner">
                      <p className="text-xs text-amber-950 text-center leading-relaxed font-serif italic whitespace-pre-line">
                        {poem}
                      </p>
                      
                      <button
                        onClick={speakPoemText}
                        disabled={!poem}
                        className={`py-2 px-4 rounded-xl text-[11px] font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isPlayingPoem
                            ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                            : 'bg-rose-500 hover:bg-rose-400 text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {isPlayingPoem ? 'Đang đọc thơ cho bé...' : 'Nghe Thỏ Đọc Thơ'}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: TRACING PRACTICE */}
          {activeTab === 'trace' && (
            <motion.div
              key="trace-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left letter picker sidebar */}
              <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col gap-3 max-h-[500px]">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  ✍️ Chọn Chữ Luyện Viết
                </h3>
                <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2 pr-1">
                  {VIETNAMESE_ALPHABET.map((item) => (
                    <button
                      key={item.letter}
                      onClick={() => { sound.playPop(); setSelectedLetter(item); }}
                      className={`py-2.5 rounded-xl border font-bold text-base transition-all cursor-pointer ${
                        selectedLetter.letter === item.letter
                          ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md shadow-emerald-100'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'
                      }`}
                    >
                      {item.lowercase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main chalkboard workspace */}
              <div className="lg:col-span-9 flex flex-col gap-4">
                <BlackboardTracing letter={selectedLetter} />
              </div>
            </motion.div>
          )}

          {/* TAB 3: EDUCATIONAL QUIZ GAME */}
          {activeTab === 'game' && (
            <motion.div
              key="game-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto w-full"
            >
              <EducationalGame />
            </motion.div>
          )}

          {/* TAB 4: AI TUTOR CHAT */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-xl mx-auto w-full"
            >
              <AITutorChat />
            </motion.div>
          )}

          {/* TAB 5: PARENT DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full"
            >
              <ParentDashboard />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-white border-t border-amber-100 mt-auto py-5 px-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>
            © 2026 Bé Học Vui - Đố Vui & Luyện Chữ Tiếng Việt. Mọi quyền được bảo lưu.
          </span>
          <span className="font-mono text-[10px] text-amber-500">
            Dành riêng cho học sinh Lớp 1 • Chuẩn Tiếng Việt Bộ GD&ĐT
          </span>
        </div>
      </footer>

      {/* CONFIGURATION MODAL (API Key & Model Selection) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border-2 border-amber-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              {/* Only allow closing modal if API Key already exists */}
              {geminiSettings.hasKey() && (
                <button
                  onClick={() => { sound.playPop(); setIsSettingsOpen(false); }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer font-bold text-lg p-1"
                >
                  ✕
                </button>
              )}

              <div className="flex items-center gap-2 mb-4 text-amber-900">
                <Settings className="w-6 h-6 animate-spin-slow" />
                <h2 className="text-lg font-black">Cấu hình API Key & Model</h2>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="bg-amber-50/50 border border-amber-200/50 p-3.5 rounded-2xl">
                  <h3 className="font-bold text-amber-950 flex items-center gap-1.5 mb-1.5">
                    🔑 Hướng dẫn lấy API Key miễn phí:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
                    <li>Mở trang <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-rose-500 font-bold underline hover:text-rose-600">Google AI Studio ↗</a></li>
                    <li>Bấm nút <strong>Create API Key</strong> để lấy mã</li>
                    <li>Sao chép mã Key và dán vào ô bên dưới</li>
                  </ol>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">API Key Gemini:</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Dán AI Studio API Key tại đây..."
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl outline-none focus:border-amber-400 font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-slate-700">Chọn dòng máy AI (Model):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gemini-3-flash-preview', label: 'Flash 3 (Default)', desc: 'Nhanh & Mới nhất', recommended: true },
                      { id: 'gemini-3-pro-preview', label: 'Pro 3', desc: 'Siêu trí tuệ', recommended: false },
                      { id: 'gemini-2.5-flash', label: 'Flash 2.5', desc: 'Ổn định nhanh', recommended: false }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { sound.playPop(); setSelectedModelInput(m.id); }}
                        className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          selectedModelInput === m.id
                            ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold'
                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span className="text-[10px] font-bold">{m.label}</span>
                        <span className="text-[8px] opacity-70 mt-0.5 leading-none">{m.desc}</span>
                        {m.recommended && (
                          <span className="text-[7px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-full mt-1.5 uppercase scale-90">
                            Mặc định
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {geminiSettings.hasKey() ? (
                  <button
                    onClick={() => { sound.playPop(); setIsSettingsOpen(false); }}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                ) : (
                  <div className="flex-grow py-3 px-4 bg-rose-50 border border-rose-200 text-rose-700 text-center rounded-2xl text-[10px] font-black animate-pulse flex items-center justify-center">
                    ⚠️ Ba mẹ vui lòng nhập Key để bắt đầu
                  </div>
                )}
                <button
                  onClick={saveSettings}
                  disabled={!apiKeyInput.trim()}
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-350 active:bg-amber-500 disabled:opacity-40 text-amber-950 font-bold rounded-2xl text-xs transition-all shadow-md active:translate-y-0.5 cursor-pointer"
                >
                  Lưu cấu hình
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
