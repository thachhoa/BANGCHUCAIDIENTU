import { getStaticFallbackPoem } from './geminiClient';
import { WRITING_GUIDELINES } from './writingGuidelines';

// Dynamic script loader for CDN libraries
const loadScript = (url: string, globalName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any)[globalName]) {
      resolve((window as any)[globalName]);
      return;
    }
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      let checkCount = 0;
      const interval = setInterval(() => {
        if ((window as any)[globalName]) {
          clearInterval(interval);
          resolve((window as any)[globalName]);
        }
        if (checkCount++ > 100) {
          clearInterval(interval);
          reject(new Error(`Timeout loading ${globalName}`));
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      resolve((window as any)[globalName]);
    };
    script.onerror = () => reject(new Error(`Failed to load ${globalName}`));
    document.head.appendChild(script);
  });
};

export async function exportWordLessonPlan(letter: string, word: string, customContent?: string) {
  try {
    const docxLib = await loadScript('https://unpkg.com/docx@8.5.0/build/index.js', 'docx');
    if (!docxLib) throw new Error('Cannot load docx library');

    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } = docxLib;

    const poem = getStaticFallbackPoem(letter);
    const spec = WRITING_GUIDELINES[letter.toLowerCase()] || {
      height: '2 ô ly',
      width: '1,5 ô ly',
      strokes: 1,
      strokeNames: ['Nét cơ bản'],
      startPoint: 'Đặt bút ở dòng kẻ',
      endPoint: 'Dừng bút ở dòng kẻ',
      steps: ['Bé hãy viết nét chữ cẩn thận.']
    };

    const children = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG TIỂU HỌC BÉ HỌC VUI", bold: true, size: 20, color: "555555" })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [
          new TextRun({ text: `GIÁO ÁN GIẢNG DẠY CHỮ CÁI: CHỮ ${letter.toUpperCase()}`, bold: true, size: 32, color: "B91C1C" })
        ]
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 12, color: "E2E8F0" },
          bottom: { style: BorderStyle.SINGLE, size: 12, color: "E2E8F0" },
          left: { style: BorderStyle.SINGLE, size: 12, color: "E2E8F0" },
          right: { style: BorderStyle.SINGLE, size: 12, color: "E2E8F0" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Môn học: ", bold: true }),
                      new TextRun({ text: "Tiếng Việt Lớp 1" }),
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Chữ cái trọng tâm: ", bold: true }),
                      new TextRun({ text: `Chữ ${letter.toUpperCase()} (${letter.toLowerCase()})` }),
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Từ minh họa: ", bold: true }),
                      new TextRun({ text: `${word}` }),
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Thời lượng dự kiến: ", bold: true }),
                      new TextRun({ text: "35 phút (1 Tiết)" }),
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { before: 240 } }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "I. MỤC TIÊU BÀI HỌC", bold: true, size: 24, color: "1E3A8A" })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Nhận biết và phát âm chính xác âm/chữ cái "${letter.toUpperCase()}".` })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Tìm kiếm và gọi tên được các từ ngữ, hình vẽ minh họa tương ứng như "${word}".` })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Viết đúng quy cách nét chữ thường "${letter.toLowerCase()}": độ cao ${spec.height}, độ rộng ${spec.width}, gồm ${spec.strokes} nét chính.` })
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({ text: "II. HỌC CỤ VÀ SỰ CHUẨN BỊ", bold: true, size: 24, color: "1E3A8A" })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Bảng chữ cái điện tử Bé Học Vui (phiên bản chạy Web)." })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Phấn viết bảng xanh (hoặc bút cảm ứng trên máy tính bảng)." })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Vở ô ly và bút chì rèn nét chữ cho bé." })
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({ text: "III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU", bold: true, size: 24, color: "1E3A8A" })
        ]
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "1. Khởi động (5 phút):", bold: true, color: "B45309" })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Giáo viên hoặc phụ huynh đọc to bài thơ học chữ thú vị để kích thích sự hào hứng của trẻ:" })
        ]
      }),
      new Paragraph({
        indent: { left: 360 },
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: poem, italics: true, color: "475569" })
        ]
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "2. Khám phá & Phát âm (10 phút):", bold: true, color: "B45309" })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Nhấn nút nghe âm mẫu "${letter}" trên Bảng Chữ Cái Điện Tử để bé lặp lại.` })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Giới thiệu từ minh họa "${word}". Đánh vần mẫu và hướng dẫn trẻ nhận diện chữ cái đứng đầu từ.` })
        ]
      }),

      new Paragraph({
        children: [
          new TextRun({ text: `3. Tập viết bảng phấn (12 phút):`, bold: true, color: "B45309" })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Chiếu video hướng dẫn viết chữ mẫu sư phạm trên tab Tập Viết.` })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Hướng dẫn trẻ điểm đặt bút (${spec.startPoint}) và điểm dừng bút (${spec.endPoint}).` })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Trẻ thực hành viết trực tiếp lên bảng vẽ, đồ qua các ngôi sao chỉ dẫn để được nhận điểm thưởng từ Thỏ Trí Tuệ.` })
        ]
      }),

      new Paragraph({
        children: [
          new TextRun({ text: `4. Đố vui & Củng cố (8 phút):`, bold: true, color: "B45309" })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `Cho trẻ chơi minigame Đố Vui để nhận diện chữ vừa học trong các từ vựng khác.` })
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({ text: "IV. LỜI KHUYÊN DÀNH CHO PHỤ HUYNH", bold: true, size: 24, color: "1E3A8A" })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Khuyến khích bé tự nói và đặt câu với từ ví dụ để mở rộng vốn từ vựng." })
        ]
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Khen ngợi bé ngay khi bé đồ thành công chữ mẫu trên bảng điện tử." })
        ]
      })
    ];

    if (customContent) {
      children.push(
        new Paragraph({ spacing: { before: 240, after: 120 } }),
        new Paragraph({
          children: [
            new TextRun({ text: "V. CHI TIẾT GIÁO ÁN PHÁT TRIỂN BỞI AI TUTOR", bold: true, size: 24, color: "1E3A8A" })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: customContent })
          ]
        })
      );
    }

    const doc = new Document({
      sections: [{
        children: children
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Giao_an_chu_${letter.toUpperCase()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Word export failed:', error);
    alert('Không thể tải giáo án Word. Ba mẹ vui lòng kiểm tra kết nối mạng nhé!');
  }
}

export async function exportPowerPointPresentation(letter: string, word: string, phoneticWord: string, desc: string) {
  try {
    const PptxGenJSClass = await loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgenjs.bundle.js', 'PptxGenJS');
    if (!PptxGenJSClass) throw new Error('Cannot load pptxgenjs library');

    const pptx = new PptxGenJSClass();
    pptx.layout = 'LAYOUT_169';

    // Slide 1: Cover Slide
    const slide1 = pptx.addSlide();
    slide1.background = { fill: 'FFFDF6' };
    
    slide1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 0.4, fill: 'F59E0B' });
    slide1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0.4, w: '100%', h: 0.2, fill: 'F43F5E' });

    slide1.addText('🎈 BÉ HỌC VUI - BÀI GIẢNG ĐIỆN TỬ', {
      x: 1.0, y: 1.2, w: 8.0, h: 0.5,
      fontSize: 18, bold: true, color: 'D97706',
      align: 'left'
    });

    slide1.addText(`Khám Phá Chữ Cái: Chữ ${letter.toUpperCase()}`, {
      x: 1.0, y: 1.8, w: 8.0, h: 1.2,
      fontSize: 44, bold: true, color: 'E11D48',
      align: 'left'
    });

    slide1.addText(`Từ minh họa: "${word}" • Thiết kế chuẩn Bộ GD&ĐT Lớp 1`, {
      x: 1.0, y: 3.0, w: 8.0, h: 0.5,
      fontSize: 14, italic: true, color: '64748B',
      align: 'left'
    });

    // Slide 2: Letter and Illustration Example
    const slide2 = pptx.addSlide();
    slide2.background = { fill: 'FFFDF6' };

    slide2.addText('1. Nhận biết và phát âm', {
      x: 0.6, y: 0.4, w: 6.0, h: 0.5,
      fontSize: 20, bold: true, color: '1E3A8A'
    });

    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.0, w: 2.2, h: 2.2, fill: 'FFE4E6', line: 'FDA4AF' });
    slide2.addText(letter.toUpperCase(), {
      x: 0.8, y: 1.0, w: 2.2, h: 2.2,
      fontSize: 90, bold: true, color: 'BE123C',
      align: 'center', valign: 'middle'
    });

    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 1.0, w: 5.5, h: 2.2, fill: 'FFFBEB', line: 'FDE68A' });
    slide2.addText(`Hình mẫu: ${word}`, {
      x: 3.8, y: 1.2, w: 5.0, h: 0.4,
      fontSize: 24, bold: true, color: '78350F'
    });
    slide2.addText(`Đánh vần: ${phoneticWord}`, {
      x: 3.8, y: 1.7, w: 5.0, h: 0.4,
      fontSize: 16, italic: true, color: 'B45309'
    });
    slide2.addText(desc, {
      x: 3.8, y: 2.2, w: 5.0, h: 0.8,
      fontSize: 13, color: '4B5563'
    });

    // Slide 3: Writing Guideline
    const slide3 = pptx.addSlide();
    slide3.background = { fill: 'FFFDF6' };
    const spec = WRITING_GUIDELINES[letter.toLowerCase()] || {
      height: '2 ô ly',
      width: '1,5 ô ly',
      strokes: 1,
      strokeNames: ['Nét móc'],
      startPoint: 'Xem hướng dẫn',
      endPoint: 'Dừng bút',
      steps: ['Bé hãy rèn luyện chăm chỉ.']
    };

    slide3.addText('2. Quy cách viết chữ thường', {
      x: 0.6, y: 0.4, w: 6.0, h: 0.5,
      fontSize: 20, bold: true, color: '1E3A8A'
    });

    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.0, w: 2.5, h: 0.6, fill: 'EFF6FF', line: 'BFDBFE' });
    slide3.addText(`Chiều cao: ${spec.height}`, { x: 0.8, y: 1.0, w: 2.5, h: 0.6, fontSize: 13, bold: true, color: '1E40AF', align: 'center', valign: 'middle' });

    slide3.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 1.0, w: 2.5, h: 0.6, fill: 'ECFDF5', line: 'A7F3D0' });
    slide3.addText(`Chiều rộng: ${spec.width}`, { x: 3.5, y: 1.0, w: 2.5, h: 0.6, fontSize: 13, bold: true, color: '065F46', align: 'center', valign: 'middle' });

    slide3.addShape(pptx.shapes.RECTANGLE, { x: 6.2, y: 1.0, w: 3.0, h: 0.6, fill: 'FDF2F8', line: 'FBCFE8' });
    slide3.addText(`Số nét vẽ: ${spec.strokes} nét`, { x: 6.2, y: 1.0, w: 3.0, h: 0.6, fontSize: 13, bold: true, color: '9D174D', align: 'center', valign: 'middle' });

    slide3.addText('Các bước thực hành:', { x: 0.8, y: 1.8, w: 8.4, h: 0.3, fontSize: 15, bold: true, color: '374151' });
    let stepsText = spec.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    slide3.addText(stepsText, {
      x: 0.8, y: 2.2, w: 8.4, h: 1.4,
      fontSize: 12, color: '4B5563',
      lineSpacing: 18
    });

    // Slide 4: Quiz & Fun Challenge
    const slide4 = pptx.addSlide();
    slide4.background = { fill: 'FFFDF6' };

    slide4.addText('3. Câu đố vui củng cố', {
      x: 0.6, y: 0.4, w: 6.0, h: 0.5,
      fontSize: 20, bold: true, color: '1E3A8A'
    });

    slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.0, w: 8.4, h: 1.0, fill: 'EEF2F6', line: 'CBD5E1' });
    slide4.addText(`Bé hãy tìm các vật dụng hoặc con vật bắt đầu bằng chữ cái "${letter.toUpperCase()}" xung quanh lớp học hoặc ngôi nhà của mình nhé!`, {
      x: 1.0, y: 1.0, w: 8.0, h: 1.0,
      fontSize: 14, color: '1E293B',
      align: 'center', valign: 'middle'
    });

    slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 2.3, w: 2.0, h: 1.2, fill: 'FFFFFF', line: 'E2E8F0' });
    slide4.addText('Ví dụ 1:\n' + word, { x: 1.5, y: 2.3, w: 2.0, h: 1.2, fontSize: 13, bold: true, color: '475569', align: 'center', valign: 'middle' });

    slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.9, y: 2.3, w: 2.0, h: 1.2, fill: 'FFFFFF', line: 'E2E8F0' });
    slide4.addText('Ví dụ 2:\nTìm thêm từ...', { x: 3.9, y: 2.3, w: 2.0, h: 1.2, fontSize: 13, color: '94A3B8', align: 'center', valign: 'middle' });

    slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.3, y: 2.3, w: 2.0, h: 1.2, fill: 'FFFFFF', line: 'E2E8F0' });
    slide4.addText('Ví dụ 3:\nĐọc to cùng bạn!', { x: 6.3, y: 2.3, w: 2.0, h: 1.2, fontSize: 13, color: '94A3B8', align: 'center', valign: 'middle' });

    pptx.writeFile({ fileName: `Bai_giang_chu_${letter.toUpperCase()}.pptx` });
  } catch (error) {
    console.error('PowerPoint export failed:', error);
    alert('Không thể tải slide PowerPoint. Ba mẹ vui lòng kiểm tra kết nối mạng nhé!');
  }
}
