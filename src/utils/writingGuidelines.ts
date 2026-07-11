export interface WritingSpec {
  height: string;
  width: string;
  strokes: number;
  strokeNames: string[];
  startPoint: string;
  endPoint: string;
  steps: string[];
}

export const WRITING_GUIDELINES: Record<string, WritingSpec> = {
  a: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 2,
    strokeNames: ["Nét cong kín", "Nét móc ngược phải hẹp"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút, viết nét cong kín từ phải sang trái.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút dưới đường kẻ ngang 3 một chút, viết nét cong kín tròn trịa cao 2 ô ly.",
      "Bước 2: Lia bút lên đường kẻ ngang 3, viết nét móc ngược phải sát nét cong kín, dừng ở đường kẻ ngang 2."
    ]
  },
  ă: {
    height: "2 ô ly (thêm dấu á)",
    width: "1,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét cong kín", "Nét móc ngược phải", "Dấu á (nét cong dưới nhỏ)"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 viết chữ cái a thường.",
    endPoint: "Dừng bút ở đường kẻ ngang 2 rồi lia bút viết dấu á trên đầu.",
    steps: [
      "Bước 1: Viết nét cong kín tương tự chữ a.",
      "Bước 2: Viết nét móc ngược phải sát nét cong kín, dừng ở đường kẻ ngang 2.",
      "Bước 3: Lia bút lên trên đường kẻ 3 viết nét cong dưới nhỏ (mũ á) cân đối."
    ]
  },
  â: {
    height: "2 ô ly (thêm dấu mũ â)",
    width: "1,5 ô ly",
    strokes: 4,
    strokeNames: ["Nét cong kín", "Nét móc ngược phải", "Nét thẳng xiên ngắn trái", "Nét thẳng xiên ngắn phải"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 viết tương tự chữ a thường.",
    endPoint: "Dừng bút ở đường kẻ ngang 2 rồi viết thêm dấu mũ â ở giữa đường kẻ 3 và 4.",
    steps: [
      "Bước 1 & 2: Viết hoàn thành chữ a thường.",
      "Bước 3: Viết hai nét xiên ngắn tạo chiếc mũ gấp khúc cân đối đặt phía trên đầu chữ."
    ]
  },
  b: {
    height: "5 ô ly",
    width: "2,5 ô ly",
    strokes: 1,
    strokeNames: ["Nét khuyết xuôi liền mạch với nét móc ngược có thắt"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở gần đường kẻ ngang 3.",
    steps: [
      "Bước 1: Đặt bút trên đường kẻ 2, viết nét khuyết xuôi cao 5 ô ly chạm đường kẻ ngang 6.",
      "Bước 2: Kéo thẳng xuống dòng kẻ đậm, lượn cong xiên lên viết nét móc ngược phải và thắt nút thắt nhỏ ở gần đường kẻ 3."
    ]
  },
  c: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 1,
    strokeNames: ["Nét cong hở phải"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút.",
    endPoint: "Dừng bút ở giữa đường kẻ ngang 1 và đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút dưới đường kẻ ngang 3, lượn bút xiên lên chạm đường kẻ 3.",
      "Bước 2: Viết nét cong hở phải lượn tròn cong xuống chạm dòng kẻ đậm 1 và dừng bút ở khoảng giữa ô ly thứ nhất."
    ]
  },
  d: {
    height: "4 ô ly",
    width: "2,5 ô ly",
    strokes: 2,
    strokeNames: ["Nét cong kín", "Nét móc ngược phải dài"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút dưới đường kẻ ngang 3, viết nét cong kín tương tự chữ o.",
      "Bước 2: Lia bút lên đường kẻ ngang 5, viết nét móc ngược dài 4 ô ly dính sát với nét cong kín, dừng ở đường kẻ 2."
    ]
  },
  đ: {
    height: "4 ô ly",
    width: "2,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét cong kín", "Nét móc ngược phải dài", "Nét ngang ngắn"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 viết nét cong kín.",
    endPoint: "Dừng bút ở đường kẻ ngang 2, viết thêm nét ngang ngắn.",
    steps: [
      "Bước 1 & 2: Thực hiện viết chữ d thường chuẩn mực.",
      "Bước 3: Lia bút viết một nét ngang ngắn trùng đường kẻ ngang 4 cắt ngang thân nét thẳng."
    ]
  },
  e: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 1,
    strokeNames: ["Nét thắt lượn vòng cong hở phải"],
    startPoint: "Đặt bút trên đường kẻ ngang 1 một chút.",
    endPoint: "Dừng bút ở giữa đường kẻ ngang 1 và đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút trên đường kẻ 1, viết nét xiên lượn chéo lên đường kẻ ngang 3 tạo một nét thắt nhỏ.",
      "Bước 2: Tiếp tục lượn tròn đều viết nét cong hở phải rộng chạm dòng kẻ đậm, dừng ở giữa ô thứ nhất."
    ]
  },
  ê: {
    height: "2 ô ly (thêm mũ)",
    width: "1,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét thắt cong hở phải", "Hai nét xiên ngắn tạo mũ"],
    startPoint: "Đặt bút viết chữ e thường.",
    endPoint: "Dừng bút ở giữa đường kẻ ngang 1 và 2, lia bút đặt dấu mũ ê.",
    steps: [
      "Bước 1: Viết hoàn tất chữ e thường chuẩn.",
      "Bước 2: Viết hai nét xiên ngắn dính nhau tạo chiếc mũ nhỏ nhắn cân đối giữa đường kẻ 3 và đường kẻ 4."
    ]
  },
  g: {
    height: "5 ô ly (2 ô ly trên dòng, 3 ô ly dưới dòng)",
    width: "2 ô ly",
    strokes: 2,
    strokeNames: ["Nét cong kín", "Nét khuyết ngược"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Viết nét cong kín tròn trịa cao 2 ô ly.",
      "Bước 2: Đặt bút từ đường kẻ ngang 3, kéo một nét thẳng dài xuống dưới dòng kẻ đậm 3 ô ly, lượn khuyết ngược dừng bút ở đường kẻ 2."
    ]
  },
  h: {
    height: "5 ô ly",
    width: "3 ô ly",
    strokes: 2,
    strokeNames: ["Nét khuyết xuôi", "Nét móc hai đầu"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút trên đường kẻ ngang 2, viết nét khuyết xuôi cao 5 ô ly chạm đường kẻ ngang 6.",
      "Bước 2: Từ điểm dừng, rê bút lên gần đường kẻ ngang 2 viết tiếp nét móc hai đầu liền mạch, dừng ở đường kẻ ngang 2."
    ]
  },
  i: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 2,
    strokeNames: ["Nét hất", "Nét móc ngược phải", "Dấu chấm"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2, chấm nhỏ phía trên.",
    steps: [
      "Bước 1: Đặt bút ở đường kẻ 2, viết nét hất xiên góc lên đường kẻ ngang 3.",
      "Bước 2: Kéo thẳng nét móc ngược phải chạm dòng kẻ đậm và dừng ở đường kẻ 2. Lia bút lên chấm một chấm nhỏ ở đường kẻ 3."
    ]
  },
  k: {
    height: "5 ô ly",
    width: "3 ô ly",
    strokes: 2,
    strokeNames: ["Nét khuyết xuôi", "Nét thắt giữa"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Viết nét khuyết xuôi cao 5 ô ly tương tự chữ h.",
      "Bước 2: Rê bút lên gần đường kẻ 2, viết nét thắt giữa (với nút thắt nhỏ đặc trưng ở giữa thân chữ), dừng ở đường kẻ ngang 2."
    ]
  },
  l: {
    height: "5 ô ly",
    width: "2 ô ly",
    strokes: 1,
    strokeNames: ["Nét khuyết xuôi kết hợp nét móc ngược phải ở cuối"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút trên đường kẻ ngang 2, viết nét khuyết xuôi cao 5 ô ly lượn cong tròn chạm đường kẻ ngang 6.",
      "Bước 2: Tiếp tục kéo thẳng xuống chạm dòng kẻ đậm rồi lượn cong xiên lên viết nét móc ngược phải dừng ở đường kẻ ngang 2."
    ]
  },
  m: {
    height: "2 ô ly",
    width: "3 ô ly",
    strokes: 3,
    strokeNames: ["Nét móc xuôi hẹp", "Nét móc xuôi rộng", "Nét móc hai đầu"],
    startPoint: "Đặt bút giữa đường kẻ ngang 2 và đường kẻ ngang 3.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút giữa đường kẻ 2 và 3, viết nét móc xuôi thứ nhất rộng 1 ô ly.",
      "Bước 2: Rê bút viết nét móc xuôi thứ hai rộng hơn (1,25 ô ly).",
      "Bước 3: Rê bút viết nét móc hai đầu liền mạch lượn dừng ở đường kẻ ngang 2."
    ]
  },
  n: {
    height: "2 ô ly",
    width: "2 ô ly",
    strokes: 2,
    strokeNames: ["Nét móc xuôi", "Nét móc hai đầu"],
    startPoint: "Đặt bút giữa đường kẻ ngang 2 và đường kẻ ngang 3.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút giữa đường kẻ 2 và 3, viết nét móc xuôi cao 2 ô ly.",
      "Bước 2: Rê bút lên gần đường kẻ ngang 3, viết nét móc hai đầu liền mạch tròn lượn dừng ở đường kẻ ngang 2."
    ]
  },
  o: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 1,
    strokeNames: ["Nét cong kín"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút.",
    endPoint: "Dừng trùng khít với điểm đặt bút.",
    steps: [
      "Bước 1: Đặt bút dưới đường kẻ ngang 3 một chút, lượn bút xiên từ phải sang trái viết nét cong kín tròn trịa.",
      "Bước 2: Khép khít điểm cuối trùng điểm đầu."
    ]
  },
  ô: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét cong kín", "Dấu mũ ô (2 nét xiên ngắn)"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 viết chữ o thường.",
    endPoint: "Dừng bút khép kín, viết thêm dấu mũ ô cân đối.",
    steps: [
      "Bước 1: Viết nét cong kín giống chữ o.",
      "Bước 2: Lia bút viết chiếc mũ gấp khúc nhọn đỉnh cân đối trên đầu chữ."
    ]
  },
  ơ: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 2,
    strokeNames: ["Nét cong kín", "Nét râu nhỏ"],
    startPoint: "Đặt bút viết chữ o thường.",
    endPoint: "Dừng bút khép kín, thêm nét râu nhỏ phía trên góc phải.",
    steps: [
      "Bước 1: Viết nét cong kín tương tự chữ o.",
      "Bước 2: Lia bút viết một nét râu nhỏ từ trên đường kẻ 3 xiên dính vào đầu phải chữ o."
    ]
  },
  p: {
    height: "4 ô ly (2 ô ly trên dòng, 2 ô ly dưới dòng)",
    width: "2 ô ly",
    strokes: 3,
    strokeNames: ["Nét hất", "Nét thẳng đứng", "Nét móc hai đầu"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút ở đường kẻ ngang 2, viết nét hất xiên lên đường kẻ 3.",
      "Bước 2: Chuyển hướng kéo thẳng xuống dưới dòng kẻ đậm 2 ô ly.",
      "Bước 3: Rê bút lên đường kẻ 2 viết tiếp nét móc hai đầu dừng ở đường kẻ 2."
    ]
  },
  q: {
    height: "4 ô ly (2 ô ly trên dòng, 2 ô ly dưới dòng)",
    width: "1,5 ô ly",
    strokes: 2,
    strokeNames: ["Nét cong kín", "Nét thẳng đứng"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút.",
    endPoint: "Dừng bút ở đường kẻ 1 (phần dưới dòng kẻ đậm 2 ô ly).",
    steps: [
      "Bước 1: Viết nét cong kín cao 2 ô ly chuẩn giống chữ o.",
      "Bước 2: Đặt bút ở đường kẻ ngang 3, kéo thẳng xiên dính sát nét cong xuống dưới dòng kẻ đậm 2 ô ly."
    ]
  },
  r: {
    height: "2,25 ô ly (nhỉnh hơn 2 ly một chút)",
    width: "2 ô ly",
    strokes: 1,
    strokeNames: ["Nét thắt kết hợp móc hai đầu"],
    startPoint: "Đặt bút trên dòng kẻ đậm (đường kẻ 1).",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút từ dòng kẻ đậm, đưa chéo lên qua đường kẻ ngang 3, lượn thắt một nút nhỏ.",
      "Bước 2: Đưa nét ngang ngắn sang phải rồi chuyển hướng lượn cong viết nét móc ngược phải lượn dừng ở đường kẻ 2."
    ]
  },
  s: {
    height: "2,25 ô ly",
    width: "1,5 ô ly",
    strokes: 1,
    strokeNames: ["Nét thắt lượn cong trái dẹp"],
    startPoint: "Đặt bút trên dòng kẻ đậm (đường kẻ 1).",
    endPoint: "Dừng ở gần dòng kẻ đậm lượn hướng vào phía trong.",
    steps: [
      "Bước 1: Đặt bút từ dòng kẻ đậm viết nét xiên lên chạm trên đường kẻ ngang 3 thắt nút nhỏ.",
      "Bước 2: Viết nét cong hở trái lượn ngược dẹt dẹp cong vào bên trong, dừng ở gần dòng kẻ đậm."
    ]
  },
  t: {
    height: "3 ô ly",
    width: "1,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét hất", "Nét móc ngược phải dài", "Nét ngang ngắn"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút ở đường kẻ ngang 2 viết nét hất xiên lên đường kẻ 3.",
      "Bước 2: Kéo thẳng đứng từ đường kẻ 4 xuống dòng đậm viết nét móc ngược dừng ở đường kẻ 2.",
      "Bước 3: Viết một nét ngang ngắn thăng bằng nằm trùng đường kẻ ngang 3."
    ]
  },
  u: {
    height: "2 ô ly",
    width: "2,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét hất", "Nét móc ngược rộng", "Nét móc ngược hẹp"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút ở đường kẻ ngang 2 viết nét hất xiên lên đường kẻ 3.",
      "Bước 2: Kéo nét móc ngược phải thứ nhất rộng 1,5 ô ly.",
      "Bước 3: Rê bút lên đường kẻ ngang 3 viết tiếp nét móc ngược phải thứ hai hẹp hơn (1 ô ly), dừng ở đường kẻ 2."
    ]
  },
  ư: {
    height: "2 ô ly",
    width: "2,5 ô ly",
    strokes: 4,
    strokeNames: ["Nét hất", "Nét móc ngược rộng", "Nét móc ngược hẹp", "Nét râu nhỏ"],
    startPoint: "Đặt bút viết chữ u thường.",
    endPoint: "Dừng bút ở đường kẻ ngang 2, thêm nét râu nhỏ.",
    steps: [
      "Bước 1 & 2 & 3: Thực hiện viết hoàn thành chữ u thường chuẩn.",
      "Bước 4: Lia bút viết một nét râu nhỏ từ trên đường kẻ 3 dính nhẹ vào đầu phải của chữ."
    ]
  },
  v: {
    height: "2 ô ly",
    width: "1,5 ô ly",
    strokes: 1,
    strokeNames: ["Nét móc hai đầu có thắt ở cuối"],
    startPoint: "Đặt bút ở giữa đường kẻ ngang 2 và đường kẻ ngang 3.",
    endPoint: "Dừng bút ở gần đường kẻ ngang 3.",
    steps: [
      "Bước 1: Đặt bút giữa đường kẻ 2 và 3 viết nét móc hai đầu xuôi.",
      "Bước 2: Kéo lên viết thắt nút dẹt lượn ra góc trên bên phải, dừng bút gần đường kẻ 3."
    ]
  },
  x: {
    height: "2 ô ly",
    width: "2 ô ly",
    strokes: 2,
    strokeNames: ["Nét cong hở phải", "Nét cong hở trái"],
    startPoint: "Đặt bút dưới đường kẻ ngang 3 một chút.",
    endPoint: "Dừng bút ở giữa đường kẻ ngang 1 và đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút dưới đường kẻ 3 lượn viết nét cong hở phải giống chữ c ngược.",
      "Bước 2: Đặt bút dưới đường kẻ 3 bên đối diện lượn viết nét cong hở trái úp chặt vào nét thứ nhất."
    ]
  },
  y: {
    height: "5 ô ly (2 ô ly trên dòng, 3 ô ly dưới dòng)",
    width: "2,5 ô ly",
    strokes: 3,
    strokeNames: ["Nét hất", "Nét móc ngược phải rộng", "Nét khuyết ngược"],
    startPoint: "Đặt bút trên đường kẻ ngang 2.",
    endPoint: "Dừng bút ở đường kẻ ngang 2.",
    steps: [
      "Bước 1: Đặt bút ở đường kẻ ngang 2 viết nét hất lên đường kẻ ngang 3.",
      "Bước 2: Viết tiếp nét móc ngược rộng 1,5 ô ly liền mạch lượn cong xiên lên đường kẻ ngang 3.",
      "Bước 3: Chuyển thẳng xuống viết nét khuyết ngược sâu 3 ô ly dưới dòng kẻ đậm, lượn dừng ở đường kẻ 2."
    ]
  }
};
