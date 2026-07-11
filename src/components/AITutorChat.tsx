import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sound } from '../utils/audio';
import { Send, Sparkles, Volume2, Bot, Loader2, RefreshCw, Key, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VIETNAMESE_ALPHABET } from '../data';
import { chatWithRabbit, geminiSettings } from '../utils/geminiClient';

// Interactive dynamic template prompts for kids
interface InteractiveAction {
  id: string;
  icon: string;
  label: string;
  title: string;
  colorClass: string;
  prompt: (char: string) => string;
}

const AI_TUTOR_ACTIONS: InteractiveAction[] = [
  {
    id: 'write',
    icon: '✍️',
    title: 'Cách viết chữ',
    label: 'Dạy con viết',
    colorClass: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800 hover:border-emerald-300',
    prompt: (char: string) => `Dạy bé cách viết chữ ${char} thường thật chi tiết, từng bước một dễ thương nhé Thỏ ơi!`
  },
  {
    id: 'story',
    icon: '📖',
    title: 'Kể chuyện cổ tích',
    label: 'Kể chuyện',
    colorClass: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800 hover:border-indigo-300',
    prompt: (char: string) => `Hãy kể cho bé nghe một câu chuyện cổ tích siêu ngắn cực kỳ vui nhộn và ý nghĩa liên quan đến chữ ${char} nhé!`
  },
  {
    id: 'vocabulary',
    icon: '🧠',
    title: 'Đố vui từ vựng',
    label: 'Đố từ vựng',
    colorClass: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800 hover:border-rose-300',
    prompt: (char: string) => `Đố bé tìm 3 từ vựng ngộ nghĩnh chuẩn lớp 1 chứa chữ ${char} và giải thích nghĩa thật đơn giản cho bé nhé!`
  },
  {
    id: 'riddle',
    icon: '🎈',
    title: 'Đố vui con vật',
    label: 'Câu đố con vật',
    colorClass: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 hover:border-amber-300',
    prompt: (char: string) => `Hãy sáng tác hoặc đặt một câu đố vui bằng thơ lục bát để đố bé đoán một con vật hoặc đồ vật thú vị bắt đầu bằng chữ ${char} nha!`
  }
];

export const AITutorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Chào bé ngoan nha! Thỏ Trí Tuệ vểnh tai nghe đây! Bé muốn học chữ cái gì hôm nay, hay muốn nghe Thỏ kể chuyện cổ tích chữ cái nào? 🐰✨',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [hasApiKey, setHasApiKey] = useState(geminiSettings.hasKey());
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Check API key availability periodically or on component focus
  useEffect(() => {
    const checkKey = () => {
      setHasApiKey(geminiSettings.hasKey());
    };
    checkKey();
    window.addEventListener('storage', checkKey);
    // Listen for custom settings closed event to re-evaluate key status
    window.addEventListener('gemini-settings-updated', checkKey);
    return () => {
      window.removeEventListener('storage', checkKey);
      window.removeEventListener('gemini-settings-updated', checkKey);
    };
  }, []);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech for a given chat message
  const handleSpeak = (text: string, msgId: string) => {
    sound.playPop();
    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
    } else {
      setIsSpeaking(msgId);
      sound.speakVietnamese(
        text,
        () => {},
        () => setIsSpeaking(null)
      );
    }
  };

  // Submit message to Gemini AI using client-side sdk wrapper
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    sound.playPop();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!geminiSettings.hasKey()) {
        throw new Error('API_KEY_MISSING');
      }

      // Call client-side gemini client utility instead of backend Express
      const replyText = await chatWithRabbit(textToSend, messages.slice(-10));

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText || "Thỏ mải nhai cà rốt nên nghe chưa rõ, bé hỏi lại nhé!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Automatically speak the rabbit's reply!
      handleSpeak(aiMsg.text, aiMsg.id);

    } catch (error: any) {
      console.error(error);
      
      let errorText = `Đã xảy ra lỗi kết nối: ${error.message || error}`;
      
      if (error.message === 'API_KEY_MISSING') {
        errorText = 'Ba mẹ ơi! Hãy cấu hình API Key ở biểu tượng Cài đặt ⚙️ góc trên màn hình để cùng trò chuyện với Thỏ nhé!';
      } else if (error.status === 400 || error.status === 403) {
        errorText = `Lỗi API Key không hợp lệ. Chi tiết: ${error.message || error}`;
      } else if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED'))) {
        errorText = `Lỗi 429 RESOURCE_EXHAUSTED: Thỏ Trí Tuệ đang tạm thời hết lượt gọi miễn phí. Bé vui lòng thử lại sau hoặc nhờ ba mẹ kiểm tra lại API Key nhé!`;
      }

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: errorText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    sound.playPop();
    window.speechSynthesis.cancel();
    setIsSpeaking(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Thỏ Trí Tuệ đã quay trở lại rồi bé ơi! Đố bé chữ Ă có trong con vật nào nè? 🐰',
        timestamp: new Date()
      }
    ]);
  };

  const triggerOpenSettings = () => {
    sound.playPop();
    window.dispatchEvent(new Event('open-gemini-settings'));
  };

  return (
    <div id="ai-tutor-container" className="flex flex-col h-full rounded-2xl border border-amber-200 bg-amber-50/25 shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="bg-amber-100/90 px-4 py-3 border-b border-amber-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-amber-400 border border-amber-300 flex items-center justify-center text-lg shadow-sm">
            🐰
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
              Thỏ Trí Tuệ (AI)
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-amber-700/80">Người bạn học chữ thông minh</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-1.5 hover:bg-amber-200/50 rounded-lg text-amber-800 transition-colors cursor-pointer"
          title="Xóa trò chuyện"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat logs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
        {/* API key missing warning card */}
        {!hasApiKey && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-2xl p-4 text-center my-2 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
              <Key className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-red-950 mb-1">Chưa Thiết Lập API Key Gemini</h4>
            <p className="text-[11px] text-red-800 leading-relaxed mb-3">
              Ba mẹ ơi, cần thiết lập API Key để Thỏ Trí Tuệ có thể trò chuyện và giải đáp câu hỏi của bé nhé. Việc đăng ký Key hoàn toàn miễn phí và an toàn!
            </p>
            <button
              onClick={triggerOpenSettings}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              Thiết lập API Key ngay
            </button>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-2 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm ${
              msg.sender === 'user' ? 'bg-pink-100 border border-pink-200' : 'bg-amber-300 border border-amber-200'
            }`}>
              {msg.sender === 'user' ? '👧' : '🐰'}
            </div>

            {/* Bubble */}
            <div className={`rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative group ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-tr-none'
                : 'bg-white border border-amber-100 text-amber-950 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              {/* Audio playback option for Rabbit's response */}
              {msg.sender === 'ai' && (
                <button
                  onClick={() => handleSpeak(msg.text, msg.id)}
                  className={`mt-2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                    isSpeaking === msg.id
                      ? 'bg-pink-100 text-pink-700 border border-pink-200 animate-pulse'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isSpeaking === msg.id ? 'Thỏ đang nói...' : 'Nghe Thỏ nói'}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 mr-auto max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-amber-300 border border-amber-200 flex items-center justify-center text-sm shadow-sm animate-bounce">
              🐰
            </div>
            <div className="bg-white border border-amber-100 text-amber-700 rounded-2xl rounded-tl-none p-3 text-xs shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Thỏ đang suy nghĩ đố vui...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Helper Panel with letter dropdown selection */}
      <div className="p-3 border-t border-amber-100/80 bg-gradient-to-b from-amber-50/50 to-orange-50/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 shrink-0">
              🐰 Chọn chữ cái học:
            </span>
            <select
              value={selectedLetter}
              onChange={(e) => {
                setSelectedLetter(e.target.value);
                sound.playPop();
              }}
              className="bg-transparent font-extrabold text-xs text-amber-900 outline-none cursor-pointer pr-1 focus:text-rose-600"
            >
              {VIETNAMESE_ALPHABET.map((item) => (
                <option key={item.letter} value={item.letter}>
                  Chữ {item.letter} ({item.lowercase})
                </option>
              ))}
            </select>
          </div>
          <span className="text-[10px] text-amber-800/80 font-medium italic hidden sm:inline">
            Chọn chữ rồi chọn việc bé muốn nhé! 👇
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {AI_TUTOR_ACTIONS.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => handleSendMessage(act.prompt(selectedLetter))}
              disabled={isLoading || !hasApiKey}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${act.colorClass} hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0`}
            >
              <span className="text-base bg-white/90 p-1.5 rounded-lg shadow-inner shrink-0">{act.icon}</span>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500/80 font-mono font-bold uppercase tracking-wider">{act.title}</p>
                <p className="text-[11px] font-bold truncate">{act.label} ({selectedLetter})</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 border-t border-amber-200 bg-white flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={hasApiKey ? "Nhập câu hỏi hoặc câu đố cho Thỏ..." : "Vui lòng cài đặt API Key để chat..."}
          disabled={isLoading || !hasApiKey}
          className="flex-1 px-3 py-2 text-xs border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || !hasApiKey}
          className="px-3 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 disabled:opacity-40 text-amber-950 font-bold rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
