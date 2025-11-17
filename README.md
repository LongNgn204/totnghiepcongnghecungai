<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎓 Ôn Thi THPT Quốc Gia - Công Nghệ với AI

Nền tảng học tập thông minh sử dụng AI (Google Gemini) để **ôn thi tốt nghiệp THPT** môn Công nghệ, dựa trên **SGK Cánh Diều** và **Chương trình GDPT 2018**.

## 🎯 Đặc biệt phục vụ ÔN THI TỐT NGHIỆP THPT

> ✅ Nội dung từ SGK Cánh Diều (Lớp 10, 11, 12)  
> ✅ Đúng cấu trúc đề thi THPT Quốc Gia  
> ✅ Phân bổ câu hỏi theo quy định  
> ✅ Gắn YCCĐ (Yêu cầu cần đạt) theo GDPT 2018  

---

## ✨ 3 Sản phẩm học tập chính

### 📚 Sản phẩm 1: Hệ thống hóa kiến thức
**Mục tiêu:** Đặt câu hỏi (lệnh) giao tiếp với AI để hệ thống hóa kiến thức một chủ đề

✅ Nhập chủ đề bất kỳ (Hệ thống điện, Động cơ, Mạch điện ba pha...)  
✅ AI phân tích và hệ thống hóa kiến thức từ SGK Cánh Diều  
✅ Tạo sơ đồ tư duy (Mind Map) trực quan  
✅ Kết quả định dạng văn bản + Mermaid diagram  
✅ Phù hợp với YCCĐ của Chương trình GDPT 2018  

### 📝 Sản phẩm 2: Ngân hàng câu hỏi trắc nghiệm
**Mục tiêu:** Xây dựng câu hỏi trắc nghiệm theo cấu trúc chuẩn

**Cấu trúc bộ câu hỏi:**
- ✅ 10 câu trắc nghiệm 4 lựa chọn:
  - 4 câu: Công nghệ 10-11 (Bản vẽ, Vật liệu, Động cơ...)
  - 3 câu: Công nghệ điện lớp 12
  - 3 câu: Công nghệ điện tử lớp 12
- ✅ 2 câu Đúng/Sai:
  - 1 câu: Công nghệ điện
  - 1 câu: Công nghệ điện tử

**Đặc điểm:**
- Ghi rõ YCCĐ (Yêu cầu cần đạt) mỗi câu
- Mức độ nhận thức: Biết / Hiểu / Vận dụng
- Làm bài và kiểm tra đáp án trực tuyến

### 🎯 Sản phẩm 3: Tạo đề thi mô phỏng **[MỚI]**
**Mục tiêu:** Tạo đề thi hoàn chỉnh chuẩn THPT Quốc Gia

**Cấu trúc đề thi (24 câu - 50 phút):**
- ✅ **Phần I:** 20 câu trắc nghiệm 4 lựa chọn
  - 8 câu: Công nghệ lớp 10-11
  - 6 câu: Công nghệ điện lớp 12
  - 6 câu: Công nghệ điện tử lớp 12
- ✅ **Phần II:** 4 câu Đúng/Sai
  - 2 câu: Công nghệ điện
  - 2 câu: Công nghệ điện tử

**Tính năng:**
- 🎯 Đề thi giống 95% đề thi thật của Bộ GD&ĐT
- ⏱️ Làm bài theo thời gian thực (50 phút)
- 📊 Tính điểm tự động + thống kê chi tiết
- ✅ Xem đáp án và giải thích YCCĐ cho từng câu
- 🖨️ In đề thi để luyện trên giấy
- 💾 Tải kết quả bài làm (file .txt)
- 🔄 Tạo đề thi mới không giới hạn
- 📚 Phân bổ chuẩn: 40% Biết, 40% Hiểu, 20% Vận dụng

---

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống
- Node.js v16+ ([Tải tại đây](https://nodejs.org))
- Trình duyệt hiện đại (Chrome, Edge, Firefox)
- Gemini API Key (Miễn phí)

### Cài đặt 3 bước

#### 1️⃣ Cài đặt dependencies
```bash
npm install
```

#### 2️⃣ Cấu hình API Key
**Lấy API Key miễn phí:**
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập Google → Create API Key
3. Copy API key

**Cấu hình:**
Mở file `.env.local` và thay:
```env
VITE_GEMINI_API_KEY=paste_your_api_key_here
```

#### 3️⃣ Chạy ứng dụng
```bash
npm run dev
```
Hoặc double-click file `start.bat` (Windows)

**Truy cập:** http://localhost:3000

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **AI:** Google Gemini API (gemini-2.0-flash-exp)
- **Visualization:** Mermaid.js (sơ đồ tư duy)
- **Build Tool:** Vite

## 📖 Hướng dẫn sử dụng

### 📚 Sản phẩm 1: Hệ thống hóa kiến thức
```
1. Chọn lớp (10/11/12)
2. Nhập chủ đề (VD: "Hệ thống điện quốc gia")
3. Nhấn "Tạo sơ đồ tư duy với AI"
4. Xem nội dung hệ thống hóa + Sơ đồ Mind Map
```

**Ứng dụng thực tế:**
- ✅ Ôn tập nhanh trước kỳ thi
- ✅ Hiểu rõ cấu trúc kiến thức
- ✅ Tạo tài liệu ôn tập cá nhân

### 📝 Sản phẩm 2: Tạo câu hỏi trắc nghiệm
```
1. Chọn lớp + Số lượng câu hỏi
2. Nhập chủ đề (VD: "Công nghệ điện")
3. Nhấn "Tạo câu hỏi với AI"
4. Làm bài + Kiểm tra đáp án
```

**Cấu trúc mặc định:**
- 10 câu 4 lựa chọn (4 câu lớp 10-11, 3 điện, 3 điện tử)
- 2 câu Đúng/Sai (1 điện, 1 điện tử)

### 🎯 Sản phẩm 3: Đề thi mô phỏng
```
1. Chọn lớp cần ôn tập
2. Nhấn "Tạo đề thi mô phỏng"
3. Làm bài (24 câu - 50 phút)
4. Nộp bài → Xem điểm + Đáp án
```

**Đặc biệt:**
- ✅ Đúng cấu trúc đề thi THPT Quốc Gia
- ✅ Tính điểm tự động
- ✅ Tính thời gian làm bài
- ✅ Tạo đề mới không giới hạn

---

## 🎯 Phục vụ đối tượng

### 👨‍🎓 Học sinh lớp 12
- Ôn thi tốt nghiệp THPT hiệu quả
- Luyện đề không giới hạn
- Tự đánh giá năng lực

### 👩‍🏫 Giáo viên
- Tạo tài liệu giảng dạy nhanh
- Biên soạn đề kiểm tra
- Hệ thống hóa kiến thức

### 🏫 Nhà trường
- Công cụ hỗ trợ ôn thi miễn phí
- Áp dụng AI vào giảng dạy
- Nâng cao chất lượng ôn tập

---

## 🌟 Ưu điểm vượt trội

| Tiêu chí | Truyền thống | Với AI |
|----------|--------------|---------|
| **Tốc độ** | Biên soạn thủ công mất nhiều giờ | Tạo trong 30-60 giây |
| **Số lượng** | Hạn chế | Không giới hạn |
| **Cá nhân hóa** | Khó | Dễ dàng theo nhu cầu |
| **Chi phí** | Cao (sách, tài liệu) | Miễn phí |
| **Cập nhật** | Chậm | Ngay lập tức |

---

## 📄 License

Educational Project - Free to use for learning purposes

---

Made with ❤️ for Vietnamese students
