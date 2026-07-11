import React from 'react';
import { LetterData } from '../types';

interface CursivePaperProps {
  letter: LetterData;
}

export const CursivePaper: React.FC<CursivePaperProps> = ({ letter }) => {
  return (
    <div id="cursive-paper-root" className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-sky-200 bg-sky-50/30 p-1 flex flex-col shadow-inner">
      {/* Title bar of the notebook */}
      <div className="bg-sky-100/80 px-4 py-2 border-b border-sky-200 flex justify-between items-center text-xs text-sky-800 font-medium">
        <span>Vở Ô Ly Tập Viết</span>
        <span className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
        </span>
      </div>

      {/* Grid container with custom "ô ly học sinh" background */}
      <div 
        id="notebook-grid-canvas" 
        className="relative flex-1 bg-white"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(14, 165, 233, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px, 16px 16px, 80px 80px, 80px 80px',
        }}
      >
        {/* Pink left margin line typical in Vietnamese student notebooks */}
        <div className="absolute top-0 bottom-0 left-[48px] w-0.5 bg-rose-300"></div>

        {/* Cursive text rendering */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pl-12">
          {/* Main letter display */}
          <div className="flex items-baseline gap-10">
            {/* Uppercase Cursive */}
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs font-semibold mb-1">Chữ in hoa</span>
              <span className="font-serif italic text-7xl md:text-8xl select-none text-sky-900 tracking-wide font-normal">
                {letter.uppercase}
              </span>
            </div>

            {/* Lowercase Cursive */}
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs font-semibold mb-1">Chữ viết tay</span>
              <span className="font-handwriting text-7xl md:text-8xl select-none text-rose-600 tracking-wide font-medium">
                {letter.lowercase}
              </span>
            </div>
          </div>

          {/* Letter tracing representation */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-sky-50 border border-sky-100 rounded-full text-xs text-sky-800 font-medium">
              Nét chữ thanh đậm chuẩn Bộ Giáo Dục
            </span>
          </div>
        </div>
        
        {/* Subtle decorative grid borders */}
        <div className="absolute bottom-2 right-4 text-[10px] font-mono text-sky-300">
          Trang 1 / Tập Viết Vui
        </div>
      </div>
    </div>
  );
};
