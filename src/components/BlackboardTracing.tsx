import React, { useRef, useState, useEffect } from 'react';
import { LetterData } from '../types';
import { sound } from '../utils/audio';
import { RotateCcw, Award, BookOpen, Video, Sparkles, Star, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WRITING_GUIDELINES } from '../utils/writingGuidelines';

// Mapping of Vietnamese lowercase letters to high-quality standard educational writing videos on YouTube
const LETTER_VIDEOS: Record<string, string> = {
  'a': 'X9rL0Gv_uO4',
  'ă': 'e5qL0kfJZGh',
  'â': 'VvTfP6m_7Eo',
  'b': 'dQ3C9MPl7_c',
  'c': 'X9rL0Gv_uO4',
  'd': 'X9rL0Gv_uO4',
  'đ': 'X9rL0Gv_uO4',
  'e': 'CeupJXJYtS4',
  'ê': 'CeupJXJYtS4',
  'g': 'dQ3C9MPl7_c',
  'h': 'dQ3C9MPl7_c',
  'i': 'n6zGZtA7t9U',
  'k': 'dQ3C9MPl7_c',
  'l': 'dQ3C9MPl7_c',
  'm': 'n6zGZtA7t9U',
  'n': 'n6zGZtA7t9U',
  'o': 'X9rL0Gv_uO4',
  'ô': 'X9rL0Gv_uO4',
  'ơ': 'X9rL0Gv_uO4',
  'p': 'dQ3C9MPl7_c',
  'q': 'dQ3C9MPl7_c',
  'r': 'n6zGZtA7t9U',
  's': 'n6zGZtA7t9U',
  't': 'n6zGZtA7t9U',
  'u': 'n6zGZtA7t9U',
  'ư': 'n6zGZtA7t9U',
  'v': 'n6zGZtA7t9U',
  'x': 'n6zGZtA7t9U',
  'y': 'dQ3C9MPl7_c'
};

interface BlackboardTracingProps {
  letter: LetterData;
}

export const BlackboardTracing: React.FC<BlackboardTracingProps> = ({ letter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [chalkColor, setChalkColor] = useState('#ffffff'); // Chalk white
  const [stars, setStars] = useState<{ x: number; y: number; hit: boolean; id: number }[]>([]);

  // Initialize the blackboard canvas and stars based on the selected letter's coordinates
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasWon(false);

    const w = canvas.width;
    const h = canvas.height;
    
    let letterStars: { x: number; y: number; hit: boolean; id: number }[] = [];
    const l = letter.lowercase.toLowerCase();

    if (isUppercase) {
      const u = letter.uppercase.toUpperCase();
      // Stars layout for uppercase letters
      if (u === 'A' || u === 'Ă' || u === 'Â') {
        letterStars = [
          { x: w * 0.32, y: h * 0.75, hit: false, id: 1 }, // bottom left
          { x: w * 0.42, y: h * 0.50, hit: false, id: 2 }, // mid left
          { x: w * 0.50, y: h * 0.25, hit: false, id: 3 }, // top vertex
          { x: w * 0.58, y: h * 0.50, hit: false, id: 4 }, // mid right
          { x: w * 0.68, y: h * 0.75, hit: false, id: 5 }  // bottom right
        ];
      } else if (u === 'B' || u === 'D' || u === 'Đ' || u === 'P' || u === 'R') {
        letterStars = [
          { x: w * 0.35, y: h * 0.25, hit: false, id: 1 }, // top left
          { x: w * 0.35, y: h * 0.75, hit: false, id: 2 }, // bottom left
          { x: w * 0.55, y: h * 0.35, hit: false, id: 3 }, // top loop
          { x: w * 0.35, y: h * 0.50, hit: false, id: 4 }, // mid stem
          { x: w * 0.55, y: h * 0.65, hit: false, id: 5 }  // bottom loop
        ];
      } else if (u === 'C' || u === 'G' || u === 'O' || u === 'Ô' || u === 'Ơ' || u === 'Q') {
        letterStars = [
          { x: w * 0.62, y: h * 0.35, hit: false, id: 1 }, // top right
          { x: w * 0.50, y: h * 0.25, hit: false, id: 2 }, // top
          { x: w * 0.38, y: h * 0.50, hit: false, id: 3 }, // left
          { x: w * 0.50, y: h * 0.75, hit: false, id: 4 }, // bottom
          { x: w * 0.62, y: h * 0.65, hit: false, id: 5 }  // bottom right
        ];
      } else if (u === 'M' || u === 'N' || u === 'V' || u === 'X' || u === 'Y') {
        letterStars = [
          { x: w * 0.32, y: h * 0.75, hit: false, id: 1 }, // bottom left
          { x: w * 0.32, y: h * 0.25, hit: false, id: 2 }, // top left
          { x: w * 0.50, y: h * 0.50, hit: false, id: 3 }, // center
          { x: w * 0.68, y: h * 0.25, hit: false, id: 4 }, // top right
          { x: w * 0.68, y: h * 0.75, hit: false, id: 5 }  // bottom right
        ];
      } else {
        // Default uppercase (E, Ê, H, I, K, L, S, T, U, Ư)
        letterStars = [
          { x: w * 0.35, y: h * 0.25, hit: false, id: 1 },
          { x: w * 0.65, y: h * 0.25, hit: false, id: 2 },
          { x: w * 0.50, y: h * 0.50, hit: false, id: 3 },
          { x: w * 0.35, y: h * 0.75, hit: false, id: 4 },
          { x: w * 0.65, y: h * 0.75, hit: false, id: 5 }
        ];
      }
    } else {
      // Lowercase letters logic
      if (l === 'a' || l === 'ă' || l === 'â') {
        letterStars = [
          { x: w * 0.35, y: h * 0.6, hit: false, id: 1 },
          { x: w * 0.48, y: h * 0.45, hit: false, id: 2 },
          { x: w * 0.62, y: h * 0.45, hit: false, id: 3 },
          { x: w * 0.5, y: h * 0.65, hit: false, id: 4 },
          { x: w * 0.62, y: h * 0.75, hit: false, id: 5 }
        ];
      } else if (l === 'b' || l === 'h' || l === 'k' || l === 'l') {
        letterStars = [
          { x: w * 0.35, y: h * 0.25, hit: false, id: 1 },
          { x: w * 0.35, y: h * 0.55, hit: false, id: 2 },
          { x: w * 0.35, y: h * 0.75, hit: false, id: 3 },
          { x: w * 0.58, y: h * 0.5, hit: false, id: 4 },
          { x: w * 0.58, y: h * 0.75, hit: false, id: 5 }
        ];
      } else if (l === 'c' || l === 'o' || l === 'ô' || l === 'ơ') {
        letterStars = [
          { x: w * 0.62, y: h * 0.5, hit: false, id: 1 },
          { x: w * 0.48, y: h * 0.45, hit: false, id: 2 },
          { x: w * 0.35, y: h * 0.6, hit: false, id: 3 },
          { x: w * 0.48, y: h * 0.75, hit: false, id: 4 },
          { x: w * 0.62, y: h * 0.7, hit: false, id: 5 }
        ];
      } else if (l === 'd' || l === 'đ') {
        letterStars = [
          { x: w * 0.62, y: h * 0.25, hit: false, id: 1 },
          { x: w * 0.42, y: h * 0.5, hit: false, id: 2 },
          { x: w * 0.62, y: h * 0.5, hit: false, id: 3 },
          { x: w * 0.48, y: h * 0.75, hit: false, id: 4 },
          { x: w * 0.62, y: h * 0.75, hit: false, id: 5 }
        ];
      } else if (l === 'e' || l === 'ê') {
        letterStars = [
          { x: w * 0.38, y: h * 0.6, hit: false, id: 1 },
          { x: w * 0.58, y: h * 0.55, hit: false, id: 2 },
          { x: w * 0.48, y: h * 0.45, hit: false, id: 3 },
          { x: w * 0.35, y: h * 0.65, hit: false, id: 4 },
          { x: w * 0.58, y: h * 0.72, hit: false, id: 5 }
        ];
      } else if (l === 'g' || l === 'y' || l === 'p' || l === 'q') {
        letterStars = [
          { x: w * 0.38, y: h * 0.45, hit: false, id: 1 },
          { x: w * 0.58, y: h * 0.45, hit: false, id: 2 },
          { x: w * 0.48, y: h * 0.6, hit: false, id: 3 },
          { x: w * 0.58, y: h * 0.7, hit: false, id: 4 },
          { x: w * 0.45, y: h * 0.85, hit: false, id: 5 }
        ];
      } else if (l === 'i') {
        letterStars = [
          { x: w * 0.5, y: h * 0.35, hit: false, id: 1 },
          { x: w * 0.5, y: h * 0.5, hit: false, id: 2 },
          { x: w * 0.5, y: h * 0.65, hit: false, id: 3 },
          { x: w * 0.5, y: h * 0.75, hit: false, id: 4 },
          { x: w * 0.62, y: h * 0.72, hit: false, id: 5 }
        ];
      } else if (l === 't') {
        letterStars = [
          { x: w * 0.5, y: h * 0.3, hit: false, id: 1 },
          { x: w * 0.38, y: h * 0.45, hit: false, id: 2 },
          { x: w * 0.62, y: h * 0.45, hit: false, id: 3 },
          { x: w * 0.5, y: h * 0.6, hit: false, id: 4 },
          { x: w * 0.62, y: h * 0.75, hit: false, id: 5 }
        ];
      } else {
        letterStars = [
          { x: w * 0.38, y: h * 0.5, hit: false, id: 1 },
          { x: w * 0.5, y: h * 0.45, hit: false, id: 2 },
          { x: w * 0.62, y: h * 0.5, hit: false, id: 3 },
          { x: w * 0.45, y: h * 0.65, hit: false, id: 4 },
          { x: w * 0.58, y: h * 0.75, hit: false, id: 5 }
        ];
      }
    }

    setStars(letterStars);
  };

  // Re-run setup when letter, window size, or letter case toggles
  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [letter, isUppercase]);

  const getCoordinates = (e: any): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    sound.playPop();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    checkStarHit(coords.x, coords.y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.strokeStyle = chalkColor;
    ctx.shadowColor = chalkColor;
    ctx.shadowBlur = 4;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    if (e.touches) {
      e.preventDefault();
    }

    checkStarHit(coords.x, coords.y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Proximity check to active stars
  const checkStarHit = (x: number, y: number) => {
    if (hasWon) return;

    let updatedStars = [...stars];
    let changed = false;

    updatedStars = updatedStars.map(star => {
      if (!star.hit) {
        const distance = Math.hypot(star.x - x, star.y - y);
        if (distance < 26) {
          sound.playPop();
          changed = true;
          return { ...star, hit: true };
        }
      }
      return star;
    });

    if (changed) {
      setStars(updatedStars);
      
      const allHit = updatedStars.every(s => s.hit);
      if (allHit) {
        saveProgressAndShowWin();
      }
    }
  };

  const saveProgressAndShowWin = () => {
    setHasWon(true);
    sound.playSuccess();
    
    // Save to localStorage for Parent Dashboard
    try {
      const currentTraced = JSON.parse(localStorage.getItem('behọcvui_traced_letters') || '[]');
      if (!currentTraced.includes(letter.letter)) {
        currentTraced.push(letter.letter);
        localStorage.setItem('behọcvui_traced_letters', JSON.stringify(currentTraced));
        window.dispatchEvent(new Event('behọcvui_stats_updated'));
      }
    } catch (e) {
      console.error('Error saving traced progress', e);
    }
  };

  const specKey = letter.lowercase.toLowerCase();
  const spec = WRITING_GUIDELINES[specKey] || WRITING_GUIDELINES['a'];
  const [activeRightTab, setActiveRightTab] = useState<'info' | 'video'>('info');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-start">
      {/* COLUMN 1: THE BLACKBOARD WORKSPACE */}
      <div className="xl:col-span-7 flex flex-col gap-3">
        <div ref={containerRef} id="blackboard-tracing-container" className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-8 border-amber-950 bg-[#163a2c] p-1 flex flex-col shadow-xl">
          {/* Blackboard Title Bar */}
          <div className="bg-[#0f281e] px-4 py-2 border-b border-[#245340] flex justify-between items-center text-xs text-[#a2d4be] font-medium font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              BẢNG TẬP VIẾT: Chữ {isUppercase ? letter.uppercase : letter.lowercase}
            </span>
            <div className="flex items-center gap-2">
              {/* Uppercase/lowercase practice mode toggle */}
              <button
                onClick={() => {
                  sound.playPop();
                  setIsUppercase(!isUppercase);
                }}
                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-md transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
              >
                Cỡ chữ: {isUppercase ? 'Chữ Hoa' : 'Chữ Thường'}
              </button>
              <button 
                onClick={initCanvas}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-md transition-colors cursor-pointer text-[10px]"
              >
                <RotateCcw className="w-3 h-3" />
                Viết lại
              </button>
              <button 
                onClick={saveProgressAndShowWin}
                className="flex items-center gap-1 px-2.5 py-1 bg-yellow-400 hover:bg-yellow-350 active:bg-yellow-500 text-amber-950 font-bold rounded-md transition-colors shadow-sm cursor-pointer text-[10px]"
              >
                <Sparkles className="w-3 h-3" />
                Nộp bài ✨
              </button>
            </div>
          </div>

          {/* Actual Drawing Area */}
          <div className="relative flex-1 cursor-crosshair overflow-hidden">
            {/* Background blackboard and grid lines pattern */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[#0e3326]" />
              
              <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-4ly-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
                    <rect width="160" height="160" fill="none" />
                    <line x1="0" y1="40" x2="160" y2="40" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3,3" />
                    <line x1="0" y1="80" x2="160" y2="80" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3,3" />
                    <line x1="0" y1="120" x2="160" y2="120" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3,3" />
                    <line x1="0" y1="0" x2="160" y2="0" stroke="#ffffff" strokeWidth="1.5" />
                    <line x1="0" y1="160" x2="160" y2="160" stroke="#ffffff" strokeWidth="1.5" />
                    <line x1="40" y1="0" x2="40" y2="160" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3,3" />
                    <line x1="80" y1="0" x2="80" y2="160" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3,3" />
                    <line x1="120" y1="0" x2="120" y2="160" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3,3" />
                    <line x1="0" y1="0" x2="0" y2="160" stroke="#ffffff" strokeWidth="1.5" />
                    <line x1="160" y1="0" x2="160" y2="160" stroke="#ffffff" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-4ly-pattern)" />
              </svg>
            </div>

            {/* Letter sample dashed guideline behind the drawing canvas */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.16]">
              <span 
                className={`${isUppercase ? 'font-serif' : 'font-handwriting'} text-[230px] md:text-[280px] text-white leading-none`}
                style={{ textShadow: '0 0 12px rgba(255,255,255,0.4)' }}
              >
                {isUppercase ? letter.uppercase : letter.lowercase}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 text-xs font-mono text-[#a2d4be]/80 pointer-events-none z-10">
              ✍️ Bé hãy vẽ phấn đồ theo hình nét đứt mờ màu trắng ở giữa bảng nhé!
            </div>

            {/* Canvas for drawing */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full z-0"
            />

            {/* Target stars floating elements for child guidance */}
            {stars.map((star) => (
              <div
                key={star.id}
                style={{
                  position: 'absolute',
                  left: `${star.x}px`,
                  top: `${star.y}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
                className={`transition-all duration-300 ${
                  star.hit ? 'scale-75 opacity-40' : 'scale-100 opacity-100 animate-pulse'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                  star.hit 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-yellow-400 text-amber-950 border border-yellow-300'
                }`}>
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
            ))}

            {/* Success Modal overlay */}
            <AnimatePresence>
              {hasWon && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-center z-20 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    className="bg-[#124230] border-2 border-yellow-400 rounded-2xl p-6 max-w-sm flex flex-col items-center shadow-[0_0_24px_rgba(234,179,8,0.3)]"
                  >
                    <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-amber-950 mb-4 animate-bounce">
                      <Award className="w-10 h-10 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xl font-bold text-yellow-300 mb-1">Bé Quá Xuất Sắc!</h3>
                    <p className="text-emerald-100 text-sm mb-5 leading-relaxed">
                      Bé đã hoàn thành xuất sắc nét viết chữ <strong className="text-yellow-300 text-lg">{isUppercase ? letter.uppercase : letter.lowercase}</strong> rồi! Ba mẹ khen bé ngoan nha!
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={initCanvas}
                        className="px-4 py-2 bg-[#23664d] text-emerald-50 hover:bg-[#2b7c5e] active:bg-[#1a4e3b] rounded-lg text-xs font-semibold transition-colors"
                      >
                        Viết Lại Lần Nữa
                      </button>
                      <button
                        onClick={() => {
                          setHasWon(false);
                          sound.speakVietnamese(`Bé viết chữ ${letter.letter} siêu quá!`);
                        }}
                        className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-amber-950 rounded-lg text-xs font-bold transition-colors shadow-md"
                      >
                        Nghe Khen
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chalk selection color palette */}
          <div className="bg-[#0f281e] p-3 flex justify-between items-center text-xs text-[#a2d4be] border-t border-[#245340]">
            <span>Chọn Màu Phấn:</span>
            <div className="flex gap-2.5">
              {[
                { hex: '#ffffff', label: 'Trắng' },
                { hex: '#fef08a', label: 'Vàng' },
                { hex: '#fca5a5', label: 'Hồng' },
                { hex: '#86efac', label: 'Xanh Lá' },
                { hex: '#93c5fd', label: 'Xanh Dương' }
              ].map((chalk) => (
                <button
                  key={chalk.hex}
                  onClick={() => {
                    sound.playPop();
                    setChalkColor(chalk.hex);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${
                    chalkColor === chalk.hex ? 'scale-125 border-yellow-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: chalk.hex, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}
                  title={chalk.label}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium px-2 flex items-center gap-1">
          💡 <span>Đồ nét đi qua 5 ngôi sao trên bảng phấn để nhận điểm thưởng từ Thỏ Trí Tuệ. Viết xong hãy bấm nút "Nộp bài ✨" nhé!</span>
        </div>
      </div>

      {/* COLUMN 2: PEDAGOGICAL INFO & YOUTUBE VIDEO */}
      <div className="xl:col-span-5 flex flex-col bg-white border border-slate-100 rounded-3xl p-5 shadow-sm min-h-[460px] relative overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 pb-3 mb-4 gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveRightTab('info');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeRightTab === 'info'
                ? 'bg-rose-50 text-rose-600'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Hướng Dẫn Chuẩn Bộ GD
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveRightTab('video');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeRightTab === 'video'
                ? 'bg-rose-50 text-rose-600'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Video className="w-4 h-4" />
            Video Tập Viết mẫu
          </button>
        </div>

        {activeRightTab === 'info' ? (
          <div className="flex flex-col gap-4 text-slate-700 animate-fadeIn">
            <div>
              <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Quy cách chữ viết tay thường: chữ "{letter.lowercase}"
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Tiêu chuẩn rèn nét chữ cho học sinh Lớp 1</p>
            </div>

            {/* Stats badges */}
            <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl">
              <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Độ Cao</span>
                <span className="text-sm font-extrabold text-slate-700 mt-0.5">{spec.height}</span>
              </div>
              <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Độ Rộng</span>
                <span className="text-sm font-extrabold text-slate-700 mt-0.5">{spec.width}</span>
              </div>
              <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số Nét</span>
                <span className="text-sm font-extrabold text-slate-700 mt-0.5">{spec.strokes} nét</span>
              </div>
            </div>

            {/* Pen position points */}
            <div className="space-y-3 border-l-2 border-rose-100 pl-4 py-1">
              <div>
                <span className="inline-block bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Điểm Đặt Bút
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {spec.startPoint}
                </p>
              </div>
              <div>
                <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Điểm Dừng Bút
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {spec.endPoint}
                </p>
              </div>
            </div>

            {/* Strokes description list */}
            <div>
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Tên các nét chính:</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {spec.strokeNames.map((name, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed step-by-step guideline */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-3.5 rounded-2xl border border-rose-100/50">
              <span className="text-xs font-black text-rose-700 flex items-center gap-1.5">
                📝 Các bước viết chi tiết:
              </span>
              <ul className="mt-2 space-y-1.5">
                {spec.steps.map((step, i) => (
                  <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-grow animate-fadeIn">
            <div>
              <h4 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-500" />
                Video hướng dẫn viết chữ "{letter.lowercase}" thường
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Video bài giảng sư phạm trực quan chuẩn lớp 1</p>
            </div>

            {/* Video container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${LETTER_VIDEOS[letter.lowercase.toLowerCase()] || 'FqG0u8F_vK4'}`}
                title={`Hướng dẫn viết chữ ${letter.lowercase} thường`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Alternative button in case they cannot view embed */}
            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-slate-400 text-center">
                Nếu video bị chặn hiển thị hoặc không tải được, bé hãy bấm nút dưới đây nhé:
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=huong+dan+viet+chu+${encodeURIComponent(letter.lowercase)}+thuong+lop+1`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Mở Xem Trực Tiếp Trên YouTube ↗
              </a>
            </div>

            {/* Educational advice */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                💡
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-extrabold text-slate-700">Lời khuyên của cô giáo:</span> Bé hãy quan sát thật kỹ video chuyển động bút của cô giáo trước, xem cách nhấc bút, uốn nét khuyết, sau đó mới bấm sang tab bên cạnh để tập tự viết nhé!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
