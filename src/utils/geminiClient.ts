import { ChatMessage } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'behọcvui_gemini_api_key',
  MODEL: 'behọcvui_gemini_model',
};

export const DEFAULT_MODEL = 'gemini-3-flash-preview';
export const FALLBACK_MODELS = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash'];

// Complete high-quality static fallback educational poems (A to Y)
export const FALLBACK_POEMS: Record<string, string> = {
  "A": "Cái ca nho nhỏ\nBé cầm trên tay\nMúc dòng nước ngọt\nUống ngon lành thay!",
  "Ă": "Chú rắn ngoằn ngoèo\nBò nhanh uốn lượn\nBé ngoan nhớ nhé\nĐừng đến gần nha!",
  "Â": "Cái ấm đun nước\nReo vui trên bếp\nTrà nóng thơm phức\nMời bà mời ông!",
  "B": "Quả bóng tròn xoe\nLăn trên sân cỏ\nBé đá bóng cùng\nCác bạn cười vui!",
  "C": "Con cá nhỏ xíu\nBơi dưới làn nước\nVây đuôi vẫy nhẹ\nBé ngắm mê say!",
  "D": "Quả dừa trên cao\nNước ngọt thanh mát\nBé uống ngụm nhỏ\nXua tan nắng hè!",
  "Đ": "Cây đàn gỗ nhỏ\nPhím nhạc reo vang\nTưng tưng tưng tứng\nBé hát nhịp nhàng!",
  "E": "Em bé miệng cười\nMắt tròn xoe tròn\nChạy nhảy tung tăng\nCả nhà thương yêu!",
  "Ê": "Chú ếch xanh ơi\nKêu vang ộp ộp\nNhảy trên lá sen\nĐón cơn mưa rào!",
  "G": "Quả gấc đỏ rực\nNấu xôi dẻo thơm\nBé ăn đầy bụng\nMá hồng xinh xinh!",
  "H": "Bông hoa nở rộ\nKhoe sắc thắm tươi\nDưới nắng ban mai\nMỉm cười với bé!",
  "I": "Viên bi tròn xoe\nLấp lánh sắc màu\nBé chơi bắn bi\nCùng bạn vui ghê!",
  "K": "Cái kéo nhỏ xinh\nCắt giấy thủ công\nXếp hình chim hạc\nTặng mẹ tặng cha!",
  "L": "Chiếc lá màu xanh\nĐón gió lung lay\nXạc xào tiếng hát\nVui đùa cùng mây!",
  "M": "Con mèo lười lắm\nKêu meo meo meo\nSưởi nắng ấm áp\nThích vuốt ve đuôi!",
  "N": "Cây nấm nhỏ xíu\nMọc dưới rừng sâu\nXòe chiếc ô nhỏ\nChe mưa cho bé!",
  "O": "O tròn quả trứng\nNhững chùm nho ngọt\nTím mọng lung linh\nĂn ngon tuyệt cú!",
  "Ô": "Ô thì đội mũ\nCái ô màu hồng\nChe mưa che nắng\nCùng bé tới trường!",
  "Ơ": "Ơ thì thêm râu\nQuả ớt đỏ au\nCay cay cay quá\nĐừng sờ bé nha!",
  "P": "Cục pin tí hon\nĐầy năng lượng tròn\nChạy chiếc xe nhỏ\nVượt dốc lon ton!",
  "Q": "Cái quạt nan nhỏ\nĐưa hương mát lành\nGió ru bé ngủ\nGió về trời xanh!",
  "R": "Chú rùa hiền lành\nRụt đầu rụt cổ\nBò chậm từng bước\nBền bỉ ngoan ngoãn!",
  "S": "Cuốn sách thơm tho\nTrang giấy trắng tinh\nDạy bé học chữ\nKể chuyện thật hay!",
  "T": "Quả táo màu đỏ\nGiòn ngọt thơm ngon\nBổ sung vitamin\nBé ăn mau lớn!",
  "U": "Cái muỗng inox\nBé cầm bên tay\nTự xúc cơm ăn\nNgoan ngoãn giỏi thay!",
  "Ư": "Lá thư gửi xa\nNét chữ nắn nón\nLời chúc ngọt ngào\nẤm áp lòng con!",
  "V": "Quyển vở xinh xắn\nNhãn hoa thơm tho\nBé rèn viết chữ\nTròn trịa rõ ràng!",
  "X": "Xe đạp nhỏ bé\nCó chiếc chuông xinh\nKính coong kính coong\nBé đạp dạo chơi!",
  "Y": "Hộp y tế nhỏ\nThuốc men sẵn sàng\nBảo vệ sức khỏe\nCả nhà bình an!"
};

export function getStaticFallbackPoem(letter: string): string {
  const norm = letter.trim().toUpperCase();
  return FALLBACK_POEMS[norm] || `${norm} tròn xinh xắn\nBé học thật ngoan\nBút màu vẽ đẹp\nCả nhà hân hoan!`;
}

export const geminiSettings = {
  getApiKey: (): string => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  },
  setApiKey: (key: string) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  },
  getModel: (): string => {
    return localStorage.getItem(STORAGE_KEYS.MODEL) || DEFAULT_MODEL;
  },
  setModel: (model: string) => {
    localStorage.setItem(STORAGE_KEYS.MODEL, model);
  },
  hasKey: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.API_KEY);
  }
};

interface GeminiRequestPayload {
  contents: any[];
  systemInstruction?: {
    parts: { text: string }[];
  };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

// Low-level fetch function to request Gemini REST API
async function callGeminiApi(
  apiKey: string,
  model: string,
  payload: GeminiRequestPayload
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP error! status: ${response.status}`;
    const code = errorData.error?.code || response.status;
    
    const err = new Error(message) as any;
    err.status = code;
    throw err;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }
  return text;
}

// Main execution client with automatic fallback models in case of rate limits or model unavailability
async function executeWithFallback(
  payload: GeminiRequestPayload,
  primaryModel: string
): Promise<string> {
  const apiKey = geminiSettings.getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)];

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      return await callGeminiApi(apiKey, model, payload);
    } catch (error: any) {
      console.warn(`Failed with model ${model}, trying next... Error:`, error.message);
      lastError = error;
      
      if (error.status === 400 && error.message.includes('API key')) {
        throw error;
      }
      if (error.status === 403) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error('All models failed to generate content');
}

// 1. Generate cute 4-line poem for learning
export async function generateLetterPoem(letter: string, word: string): Promise<string> {
  const primaryModel = geminiSettings.getModel();
  const prompt = `Hãy viết một bài thơ ngắn 4 câu (thể thơ 4 chữ hoặc 5 chữ) bằng Tiếng Việt dành cho trẻ 4 tuổi học chữ "${letter}". Bài thơ phải nhắc đến chữ "${letter}" và từ minh họa "${word}" một cách ngộ nghĩnh, vui tai, dễ thuộc lòng. Chỉ trả về đúng 4 dòng thơ, không thêm tiêu đề hay lời giải thích nào khác.`;

  const payload: GeminiRequestPayload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{ text: 'Bạn là giáo viên mầm non tài năng, chuyên sáng tác thơ ca giúp bé ghi nhớ chữ cái dễ dàng.' }]
    },
    generationConfig: {
      temperature: 0.6
    }
  };

  return await executeWithFallback(payload, primaryModel);
}

// 2. Chat with AI Tutor "Thỏ Trí Tuệ"
export async function chatWithRabbit(message: string, history: ChatMessage[]): Promise<string> {
  const primaryModel = geminiSettings.getModel();

  const systemInstruction = 
    "Bạn là nhân vật 'Thỏ Trí Tuệ', một người bạn thỏ bông thông minh, ấm áp và cực kỳ yêu trẻ em (độ tuổi mầm non 4-6 tuổi).\n" +
    "Nhiệm vụ của bạn là trò chuyện, giải đáp thắc mắc về bảng chữ cái Tiếng Việt, đánh vần, từ vựng hoặc kể chuyện ngắn cho bé.\n" +
    "Quy tắc phản hồi:\n" +
    "1. Trả lời bằng Tiếng Việt cực kỳ dễ thương, trong sáng, thân thiện. Sử dụng xưng hô phù hợp như: 'Thỏ Trí Tuệ đây bé ơi!', 'Bé giỏi quá!', 'Bé ngoan ơi'.\n" +
    "2. Giữ câu trả lời thật ngắn gọn (tối đa 3-4 câu ngắn) để trẻ không bị nản khi đọc hoặc nghe.\n" +
    "3. Khi bé hỏi về một chữ cái, hãy cho bé ví dụ về các từ bắt đầu bằng chữ đó hoặc đố bé một câu đố cực kỳ đơn giản về chữ đó.\n" +
    "4. Khuyến khích trẻ chạm vào bảng chữ cái để nghe phát âm, vẽ nét viết tay, hoặc chơi các trò chơi tìm hình minh họa có sẵn trên ứng dụng.\n" +
    "5. Thêm các âm thanh mô tả dễ thương bằng chữ như: *vểnh tai cười*, *nhảy cẫng lên*, *gật gật đầu* để tăng tính sinh động.";

  const contents: any[] = [];
  let lastRole: 'user' | 'model' | null = null;

  history.forEach((msg) => {
    if (msg.id === 'welcome') return;
    const role = msg.sender === 'user' ? 'user' : 'model';
    
    if (role === lastRole) {
      if (contents.length > 0) {
        contents[contents.length - 1].parts[0].text += '\n' + msg.text;
      }
    } else {
      contents.push({
        role: role,
        parts: [{ text: msg.text }]
      });
      lastRole = role;
    }
  });

  if (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const payload: GeminiRequestPayload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7
    }
  };

  return await executeWithFallback(payload, primaryModel);
}

// 3. Dynamic Pedagogy Exporter (Generates DOCX or PPTX content structure using Gemini)
export async function generateLessonPlanStructure(letter: string, word: string): Promise<string> {
  const primaryModel = geminiSettings.getModel();
  const prompt = `Hãy soạn một giáo án sư phạm chi tiết để dạy học sinh lớp 1 chữ cái "${letter}" (từ minh họa: "${word}"). Giáo án bao gồm: Mục tiêu bài học, Chuẩn bị học cụ, Các hoạt động lên lớp (Khởi động, Khám phá chữ mới, Thực hành viết bảng, Trò chơi củng cố), và Lời khuyên phụ huynh khi dạy ở nhà. Hãy viết bằng tiếng Việt rõ ràng, chuyên nghiệp.`;

  const payload: GeminiRequestPayload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{ text: 'Bạn là chuyên gia giáo dục mầm non và tiểu học, chuyên soạn thảo giáo án chuẩn quốc gia.' }]
    },
    generationConfig: {
      temperature: 0.5
    }
  };

  return await executeWithFallback(payload, primaryModel);
}
