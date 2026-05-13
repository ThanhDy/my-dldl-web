import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "Chưa cấu hình GEMINI_API_KEY" }, { status: 500 });
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "Không tìm thấy dữ liệu ảnh" }, { status: 400 });
    }

    // Prepare the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Ensure the base64 string is correctly formatted
    // Assuming imageBase64 is passed like "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    const base64Data = imageBase64.split(",")[1] || imageBase64;
    const mimeType = imageBase64.split(";")[0]?.split(":")[1] || "image/jpeg";

    const prompt = `
    Bạn là một trợ lý chuyên nghiệp nhập liệu cho game Đấu La Đại Lục.
    Hãy phân tích hình ảnh Hồn Hoàn Hung Thú được cung cấp và trích xuất các thông tin sau thành một định dạng JSON CHÍNH XÁC.
    
    ĐẶC BIỆT QUAN TRỌNG: 
    - Nếu hình ảnh chứa tiếng Trung (hoặc ngôn ngữ khác), hãy TỰ ĐỘNG DỊCH toàn bộ sang Tiếng Việt.
    - Khi dịch các tên Hồn Hoàn, Tên Hiệu Ứng, hoặc các thuật ngữ võ hiệp, hãy ưu tiên sử dụng từ ngữ HÁN VIỆT (Sino-Vietnamese) cho thật ngầu và đúng chất game tiên hiệp/kiếm hiệp (ví dụ: thay vì dịch là "đánh mạnh", hãy dịch là "Bạo Kích" hoặc "Cường Kích"; thay vì "gấu tàn bạo", hãy dịch là "Bạo Liệt Hùng"...).
    - CHÚ Ý MÀU SẮC TRONG HÌNH: BẮT BUỘC phải chú ý đến màu sắc của chữ viết và CÁC CON SỐ. Nếu trong hình ảnh có bất kỳ đoạn text, con số, hoặc phần trăm (%) nào CÓ MÀU SẮC KHÁC MÀU TRẮNG (ví dụ màu cam, đỏ, xanh lá, vàng...), bạn PHẢI tự động bọc đoạn đó bằng format: [màu_sắc_bằng_tiếng_anh|text]. 
      + TUYỆT ĐỐI KHÔNG điền chữ tiếng Việt hay tên kỹ năng vào vị trí "màu_sắc_bằng_tiếng_anh". Vị trí này CHỈ ĐƯỢC CHỨA một trong các từ sau: red, green, blue, yellow, orange, purple, pink, cyan, brown.
      + Ví dụ 1: Nếu số "50%" có màu vàng, BẮT BUỘC phải viết là [yellow|50%]. 
      + Ví dụ 2: Nếu chữ "Hỏa Diệm" có màu cam, viết là [orange|Hỏa Diệm]. 
      + Ví dụ 3: Nếu ghi "[Bí Kỹ] Phần Thế Liệt Diễm" có màu đỏ, hãy viết là [red|[Bí Kỹ] Phần Thế Liệt Diễm]. KHÔNG ĐƯỢC viết là [Bí Kỹ|Phần Thế Liệt Diễm].
      + Hãy soi thật kỹ các con số chỉ số (buff/debuff) vì chúng thường có màu.
    - Đối với phần mô tả hiệu ứng, dịch trôi chảy, dễ hiểu nhưng vẫn giữ văn phong game.

    Chỉ trả về JSON, không thêm bất kỳ văn bản nào khác. Không dùng Markdown code block, chỉ xuất JSON thuần tuý.

    Yêu cầu JSON có cấu trúc như sau:
    {
      "name": "Tên của hồn hoàn (dịch sang Hán Việt, ví dụ: Tâm Tướng Nội Nguyên - Sinh, Thâm Hải Ma Kình, Thiên Thanh Ngưu Mãng...)",
      "systems": ["Một hoặc nhiều hệ phù hợp trong số các lựa chọn: Cường Công, Mẫn Công, Khống Chế, Phụ Trợ/Phòng Ngự. Thường có một icon trên hình ảnh hoặc badge. Nếu là 'Tấn công' thì ghi Cường Công, Mẫn Công."],
      "type": "Regular", 
      "basicEffect": "Mô tả ngắn gọn hiệu ứng cơ bản bằng Tiếng Việt (thường nằm ở dưới cùng hình ảnh hoặc phần giới thiệu chung).",
      "yearEffects": [
        { "year": "Số năm (ví dụ: 10 Vạn Năm, 20 Vạn Năm)", "effect": "Mô tả hiệu ứng tương ứng với mốc năm đó bằng Tiếng Việt" }
      ]
    }

    Lưu ý:
    - Nếu không tìm thấy thông tin nào, hãy để chuỗi rỗng "" hoặc mảng rỗng [].
    - Định dạng mốc năm ghi rõ ràng "10 Vạn Năm", "100 Vạn Năm", v.v.
    - Đảm bảo trích xuất ĐÚNG CHÍNH TẢ.
    - Đảm bảo đầu ra LÀ MỘT CHUỖI JSON HỢP LỆ để JSON.parse() hoạt động.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    
    // Clean the JSON string if Gemini adds Markdown formatting (e.g. ```json ... ```)
    let jsonString = responseText.trim();
    if (jsonString.startsWith("\`\`\`json")) {
      jsonString = jsonString.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (jsonString.startsWith("\`\`\`")) {
      jsonString = jsonString.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Lỗi parse JSON:", jsonString);
      return NextResponse.json({ success: false, error: "AI trả về dữ liệu không đúng định dạng JSON" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Lỗi khi xử lý ảnh bằng AI" }, { status: 500 });
  }
}
