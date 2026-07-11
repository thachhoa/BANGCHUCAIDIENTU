import React, { useState, useEffect } from 'react';
import { VIETNAMESE_ALPHABET } from '../data';
import { sound } from '../utils/audio';
import { Award, BookOpen, Edit3, Trophy, RefreshCw, Star, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LearningStats {
  viewedLetters: string[]; // List of letters clicked
  tracedLetters: string[]; // List of letters successfully traced
  highScore: number;
  gameSessions: number;
}

export const ParentDashboard: React.FC = () => {
  const [stats, setStats] = useState<LearningStats>({
    viewedLetters: [],
    tracedLetters: [],
    highScore: 0,
    gameSessions: 0
  });

  const loadStats = () => {
    try {
      const viewed = JSON.parse(localStorage.getItem('behọcvui_viewed_letters') || '[]');
      const traced = JSON.parse(localStorage.getItem('behọcvui_traced_letters') || '[]');
      const score = Number(localStorage.getItem('behọcvui_game_highscore') || '0');
      const sessions = Number(localStorage.getItem('behọcvui_game_sessions') || '0');
      
      setStats({
        viewedLetters: viewed,
        tracedLetters: traced,
        highScore: score,
        gameSessions: sessions
      });
    } catch (e) {
      console.error('Error loading stats from localstorage', e);
    }
  };

  useEffect(() => {
    loadStats();
    // Listen for storage updates or tab changes
    window.addEventListener('storage', loadStats);
    window.addEventListener('behọcvui_stats_updated', loadStats);
    return () => {
      window.removeEventListener('storage', loadStats);
      window.removeEventListener('behọcvui_stats_updated', loadStats);
    };
  }, []);

  const resetStats = () => {
    if (confirm('Ba mẹ có chắc muốn đặt lại toàn bộ tiến trình học tập của bé không?')) {
      sound.playPop();
      localStorage.removeItem('behọcvui_viewed_letters');
      localStorage.removeItem('behọcvui_traced_letters');
      localStorage.removeItem('behọcvui_game_highscore');
      localStorage.removeItem('behọcvui_game_sessions');
      
      setStats({
        viewedLetters: [],
        tracedLetters: [],
        highScore: 0,
        gameSessions: 0
      });
      window.dispatchEvent(new Event('behọcvui_stats_updated'));
    }
  };

  const totalLetters = VIETNAMESE_ALPHABET.length;
  const viewedCount = stats.viewedLetters.length;
  const tracedCount = stats.tracedLetters.length;
  
  const viewedPercent = Math.round((viewedCount / totalLetters) * 100);
  const tracedPercent = Math.round((tracedCount / totalLetters) * 100);

  // SVG Chart Dimensions
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  
  const viewedStrokeDash = circumference - (viewedPercent / 100) * circumference;
  const tracedStrokeDash = circumference - (tracedPercent / 100) * circumference;

  return (
    <div id="parent-dashboard-root" className="w-full bg-white border border-amber-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* Dashboard Header */}
      <div className="flex justify-between items-center border-b border-amber-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
            📊 Bảng Theo Dõi Học Tập Của Bé
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận tiến trình học chữ cái, luyện viết bảng và chơi trò chơi đố vui của bé.
          </p>
        </div>
        <button
          onClick={resetStats}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Đặt lại tiến trình
        </button>
      </div>

      {/* Overview stats layout (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Letters Read */}
        <div className="bg-rose-50/50 border border-rose-100/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-800/80 uppercase tracking-wider">Chữ Cái Đã Học</p>
            <h3 className="text-2xl font-black text-rose-700 mt-0.5">{viewedCount} <span className="text-xs font-medium text-slate-400">/ {totalLetters}</span></h3>
            <div className="w-24 bg-rose-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${viewedPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Card 2: Letters Traced */}
        <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-800/80 uppercase tracking-wider">Chữ Cái Đã Viết</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{tracedCount} <span className="text-xs font-medium text-slate-400">/ {totalLetters}</span></h3>
            <div className="w-24 bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${tracedPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Card 3: Game Highscore */}
        <div className="bg-sky-50/50 border border-sky-100/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-sky-800/80 uppercase tracking-wider">Kỷ Lục Đố Vui</p>
            <h3 className="text-2xl font-black text-sky-700 mt-0.5">{stats.highScore} <span className="text-xs font-medium text-slate-400">điểm</span></h3>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Game Sessions */}
        <div className="bg-amber-50/50 border border-amber-100/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider">Số Lượt Vượt Ải</p>
            <h3 className="text-2xl font-black text-amber-700 mt-0.5">{stats.gameSessions} <span className="text-xs font-medium text-slate-400">lần chơi</span></h3>
            <span className="text-[10px] text-amber-800 font-medium italic mt-1.5 block">Bé chăm chỉ lắm đó!</span>
          </div>
        </div>
      </div>

      {/* SVG Circular Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Chart column 1 */}
        <div className="border border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-50/20">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r={radius} strokeWidth={strokeWidth} stroke="#FFE4E6" fill="transparent" />
              <circle 
                cx="64" cy="64" r={radius} strokeWidth={strokeWidth} stroke="#F43F5E" fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={viewedStrokeDash}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <span className="text-xl font-black text-rose-600">{viewedPercent}%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Đã Học</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">Mức độ khám phá âm thanh</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Đo lường tỉ lệ phần trăm các âm chữ cái và từ minh họa bé đã nhấn nghe. Hãy khuyến khích bé chạm vào tất cả 29 chữ cái nhé!
            </p>
          </div>
        </div>

        {/* Chart column 2 */}
        <div className="border border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-50/20">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r={radius} strokeWidth={strokeWidth} stroke="#D1FAE5" fill="transparent" />
              <circle 
                cx="64" cy="64" r={radius} strokeWidth={strokeWidth} stroke="#10B981" fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={tracedStrokeDash}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <span className="text-xl font-black text-emerald-600">{tracedPercent}%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Đã Đồ</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">Tiến độ luyện viết bảng</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Đo lường mức độ hoàn thiện rèn luyện các nét chữ viết tay thường. Trẻ viết bảng và nộp bài sẽ tích lũy thành tích tại đây.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Alphabet completed list */}
      <div className="border border-slate-100 rounded-3xl p-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Danh Sách Tiến Độ Chi Tiết (29 Chữ Cái)</h3>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {VIETNAMESE_ALPHABET.map((item) => {
            const hasViewed = stats.viewedLetters.includes(item.letter);
            const hasTraced = stats.tracedLetters.includes(item.letter);
            
            let badgeClass = "bg-slate-50 text-slate-400 border border-slate-100";
            if (hasTraced) {
              badgeClass = "bg-emerald-500 text-white border border-emerald-600 shadow-xs";
            } else if (hasViewed) {
              badgeClass = "bg-rose-100 text-rose-700 border border-rose-200";
            }

            return (
              <div 
                key={item.letter}
                className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${badgeClass}`}
                title={`Chữ ${item.letter}: ${hasTraced ? 'Đã viết' : hasViewed ? 'Đã nghe' : 'Chưa học'}`}
              >
                <span className="text-lg font-black">{item.letter}</span>
                <span className="text-[7px] font-mono mt-1 flex gap-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasViewed ? 'bg-red-400' : 'bg-slate-200'}`} title="Nghe" />
                  <span className={`w-1.5 h-1.5 rounded-full ${hasTraced ? 'bg-green-400' : 'bg-slate-200'}`} title="Viết" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
