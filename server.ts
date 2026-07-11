import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini API if GEMINI_API_KEY exists
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined in the environment. AI features will be unavailable.");
      throw new Error("GEMINI_API_KEY is required for this feature");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint: Ask "Thỏ Trí Tuệ" (AI Smart Rabbit Tutor)
app.post("/api/gemini/rabbit-chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAiClient();
    
    // System instruction to make it extremely friendly, cute, kid-appropriate (4-6 years old), and focused on Vietnamese learning
    const systemInstruction = 
      "Bạn là nhân vật 'Thỏ Trí Tuệ', một người bạn thỏ bông thông minh, ấm áp và cực kỳ yêu trẻ em (độ tuổi mầm non 4-6 tuổi).\n" +
      "Nhiệm vụ của bạn là trò chuyện, giải đáp thắc mắc về bảng chữ cái Tiếng Việt, đánh vần, từ vựng hoặc kể chuyện ngắn cho bé.\n" +
      "Quy tắc phản hồi:\n" +
      "1. Trả lời bằng Tiếng Việt cực kỳ dễ thương, trong sáng, thân thiện. Sử dụng xưng hô phù hợp như: 'Thỏ Trí Tuệ đây bé ơi!', 'Bé giỏi quá!', 'Bé ngoan ơi'.\n" +
      "2. Giữ câu trả lời thật ngắn gọn (tối đa 3-4 câu ngắn) để trẻ không bị nản khi đọc hoặc nghe.\n" +
      "3. Khi bé hỏi về một chữ cái, hãy cho bé ví dụ về các từ bắt đầu bằng chữ đó hoặc đố bé một câu đố cực kỳ đơn giản về chữ đó.\n" +
      "4. Khuyến khích trẻ chạm vào bảng chữ cái để nghe phát âm, vẽ nét viết tay, hoặc chơi các trò chơi tìm hình minh họa có sẵn trên ứng dụng.\n" +
      "5. Thêm các âm thanh mô tả dễ thương bằng chữ như: *vểnh tai cười*, *nhảy cẫng lên*, *gật gật đầu* để tăng tính sinh động.";

    // Convert client-side history if present to contents format
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in rabbit-chat:", error);
    
    // Standard kid-friendly response when rate limit or any API error occurs
    const isQuotaError = error.message && (
      error.message.includes("429") || 
      error.message.includes("quota") || 
      error.message.includes("limit") || 
      error.message.includes("EXHAUSTED")
    );

    if (isQuotaError) {
      return res.json({ 
        text: "Chào bé ngoan ơi! Thỏ Trí Tuệ vừa chạy nhảy tung tăng ngoài vườn cà rốt nên hơi mệt một xíu rồi. Bé chờ Thỏ uống ngụm nước mát rồi tụi mình lại cùng học chữ tiếp nhé! Trong lúc chờ đợi, bé hãy tập viết chữ thật đẹp ở bảng bên cạnh hoặc chơi trò chơi đoán chữ siêu vui nha! *vẫy tai chào bé*" 
      });
    }

    res.json({ 
      text: "Thỏ Trí Tuệ đây bé ơi! Sóng thần kì đang hơi yếu một chút nên Thỏ chưa nghe rõ lắm. Bé hãy nhấn nút 'Gửi lại' hoặc viết chữ lên bảng phấn siêu đẹp để khoe Thỏ nhé! *nhảy cẫng lên cổ vũ*" 
    });
  }
});

// Full Vietnamese alphabet static fallback poems (A to Y) to completely bypass 429 quota limits
const FALLBACK_POEMS: Record<string, string> = {
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

// API endpoint: Generate a cute 4-line poem for a letter
app.post("/api/gemini/generate-poem", async (req, res) => {
  const { letter, word } = req.body;
  if (!letter || !word) {
    return res.status(400).json({ error: "Letter and word are required" });
  }

  const normalizedLetter = letter.trim().toUpperCase();

  try {
    const ai = getAiClient();
    
    const prompt = `Hãy viết một bài thơ ngắn 4 câu (thể thơ 4 chữ hoặc 5 chữ) bằng Tiếng Việt dành cho trẻ 4 tuổi học chữ "${letter}". Bài thơ phải nhắc đến chữ "${letter}" và từ minh họa "${word}" một cách ngộ nghĩnh, vui tai, dễ thuộc lòng. Chỉ trả về đúng 4 dòng thơ, không thêm tiêu đề hay lời giải thích nào khác.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Bạn là giáo viên mầm non tài năng, chuyên sáng tác thơ ca giúp bé ghi nhớ chữ cái dễ dàng.",
        temperature: 0.6,
      }
    });

    res.json({ poem: response.text?.trim() });
  } catch (error: any) {
    console.error("Error generating poem (Using Fallback dictionary instead):", error);
    
    // Return the high-quality pre-written educational poem from our static fallback
    const fallbackPoem = FALLBACK_POEMS[normalizedLetter] || 
      `${normalizedLetter} tròn xinh xắn\nBé học thật ngoan\nBút màu vẽ đẹp\nCả nhà hân hoan!`;

    res.json({ poem: fallbackPoem });
  }
});

// Vite middleware and asset serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
