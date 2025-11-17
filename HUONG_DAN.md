# 🚀 Hướng dẫn sử dụng nhanh

## ⚡ Khởi động nhanh

### 1️⃣ Lấy API Key (Miễn phí)
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Nhấn "Create API Key" → Chọn project → Copy API key

### 2️⃣ Cấu hình API Key
Mở file `.env.local` và thay thế:
```
VITE_GEMINI_API_KEY=paste_your_api_key_here
```

### 3️⃣ Chạy ứng dụng
```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## 📚 Hướng dẫn chi tiết

### Sản phẩm 1: Hệ thống hóa kiến thức với AI

**Cách sử dụng:**
1. Nhấn vào tab "Sản phẩm 1: Sơ đồ tư duy"
2. Chọn lớp (10, 11, hoặc 12)
3. Nhập chủ đề cần học, ví dụ:
   - "Hệ thống điện quốc gia"
   - "Động cơ đốt trong"
   - "Mạch điện ba pha"
   - "Công nghệ điện tử"
4. Nhấn "Tạo sơ đồ tư duy với AI"
5. Chờ 10-30 giây để AI xử lý
6. Xem kết quả:
   - Nội dung hệ thống hóa chi tiết
   - Sơ đồ tư duy trực quan (Mind Map)

**Mẹo:**
- Nhập chủ đề càng cụ thể, kết quả càng chi tiết
- Có thể thử nhiều chủ đề khác nhau
- Nhấn "Làm mới" để tạo sơ đồ mới

---

### Sản phẩm 2: Tạo câu hỏi trắc nghiệm với AI

**Cách sử dụng:**
1. Nhấn vào tab "Sản phẩm 2: Câu hỏi TN"
2. Cấu hình:
   - Chọn lớp (10, 11, hoặc 12)
   - Số câu trắc nghiệm 4 lựa chọn (1-20)
   - Số câu Đúng/Sai (1-20)
3. Nhập chủ đề, ví dụ:
   - "Công nghệ điện lớp 12"
   - "Động cơ và máy công cụ"
   - "Kỹ thuật điện tử"
4. Nhấn "Tạo câu hỏi với AI"
5. Chờ 15-45 giây (tùy số lượng câu hỏi)
6. Làm bài trắc nghiệm:
   - Chọn đáp án cho từng câu
   - Nhấn "Kiểm tra đáp án"
   - Xem kết quả và giải thích

**Đặc điểm câu hỏi:**
- ✅ Bám sát SGK Cánh Diều
- ✅ Có mức độ nhận thức (Nhận biết/Thông hiểu/Vận dụng)
- ✅ Có Yêu cầu cần đạt (YCCĐ) theo chương trình
- ✅ Đáp án chính xác với giải thích

---

## 🔧 Xử lý sự cố

### Lỗi: "Vui lòng cấu hình API Key"
**Giải pháp:** Kiểm tra lại file `.env.local` đã có API key đúng chưa

### Lỗi: "API request failed"
**Giải pháp:** 
- Kiểm tra kết nối internet
- API key có thể đã hết hạn → Tạo API key mới

### AI trả về kết quả không đúng format
**Giải pháp:** Nhấn "Làm mới" và thử lại. AI đôi khi cần thử nhiều lần.

### Sơ đồ Mind Map không hiển thị
**Giải pháp:** 
- Làm mới trang (F5)
- Thử chủ đề khác cụ thể hơn

---

## 💡 Tips & Tricks

### Để có kết quả tốt nhất:

**Chủ đề nên:**
- ✅ Cụ thể: "Máy biến áp ba pha" thay vì "Điện"
- ✅ Đúng lớp: Chọn đúng lớp với chủ đề
- ✅ Trong chương trình: Dựa theo SGK Cánh Diều

**Chủ đề tránh:**
- ❌ Quá chung chung: "Công nghệ"
- ❌ Ngoài chương trình lớp đã chọn
- ❌ Nhiều chủ đề cùng lúc

### Ví dụ chủ đề hay:

**Lớp 12:**
- Hệ thống điện quốc gia
- Mạch điện xoay chiều ba pha
- Máy biến áp ba pha
- Động cơ không đồng bộ ba pha
- Linh kiện điện tử (Điốt, Transistor)
- IC khuếch đại thuật toán
- Mạch nguồn một chiều

**Lớp 11:**
- Động cơ đốt trong
- Hệ thống truyền lực ô tô
- Máy công cụ cơ khí

**Lớp 10:**
- Bản vẽ kỹ thuật
- Dung sai và lắp ghép
- Vật liệu kỹ thuật

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Đọc lại hướng dẫn này
2. Kiểm tra console (F12) xem có lỗi không
3. Thử với chủ đề mẫu trước
4. Làm mới trang và thử lại

---

**Chúc bạn học tập hiệu quả! 🎓**
