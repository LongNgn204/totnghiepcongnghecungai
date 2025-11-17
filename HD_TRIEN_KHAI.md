# 🎓 Hướng Dẫn Triển Khai Sản Phẩm Học Tập

## 📋 YÊU CẦU ĐỀ BÀI

### Sản phẩm học tập số 1: Hệ thống hóa kiến thức
**Mục tiêu:** Lựa chọn một ứng dụng AI để hệ thống hóa kiến thức một chủ đề/nội dung trong chương trình Công nghệ lớp 12 phục vụ ôn thi tốt nghiệp THPT quốc gia.

**Nội dung yêu cầu:**
1. ✅ Đặt câu hỏi (lệnh) giao tiếp với AI theo mục tiêu hệ thống hóa kiến thức
2. ✅ Đáp ứng yêu cầu cần đạt (YCCĐ) của Chương trình GDPT 2018
3. ✅ Kết quả phản hồi của AI (định dạng DOCX - sau nhiều lần hiệu chỉnh)

---

### Sản phẩm học tập số 2: Xây dựng câu hỏi trắc nghiệm
**Mục tiêu:** Lựa chọn một ứng dụng AI để xây dựng câu hỏi trắc nghiệm trong chương trình Công nghệ lớp 12 phục vụ ôn thi tốt nghiệp THPT quốc gia.

**Nội dung yêu cầu:**

**(1) Tạo 10 câu trắc nghiệm 4 lựa chọn:**
- ✅ 04 câu: Kiến thức Công nghệ 10 và 11
- ✅ 03 câu: Kiến thức Công nghệ điện (lớp 12)
- ✅ 03 câu: Kiến thức Công nghệ điện tử (lớp 12)

**(2) Tạo 2 câu trắc nghiệm Đúng/Sai:**
- ✅ 01 câu: Công nghệ điện (lớp 12)
- ✅ 01 câu: Công nghệ điện tử (lớp 12)

**(3) Hệ thống câu hỏi và đánh giá:**
- ✅ Câu hỏi (lệnh) giao tiếp với AI
- ✅ Nhận xét và đánh giá về kết quả thu được

**Lưu ý bắt buộc:**
- Ghi rõ YCCĐ (Yêu cầu cần đạt) tương ứng mỗi câu
- Mức độ nhận thức: Biết - Hiểu - Vận dụng
- Lập bảng phân công thành viên làm từng câu
- Đảm bảo mỗi thành viên tham gia biên soạn cả 2 loại câu

---

## 🚀 CÁCH SỬ DỤNG WEBSITE

### 📍 Bước 1: Cấu hình ban đầu

**1.1. Lấy Gemini API Key (Miễn phí - 1 phút)**
```
🔗 Truy cập: https://aistudio.google.com/app/apikey
📧 Đăng nhập bằng Google (Gmail @gmail.com)
🎯 Nhấn "Create API Key" → Chọn project
📋 Copy API key
```

**1.2. Cấu hình trong website**
```
📂 Mở file: .env.local
✏️ Thay thế: VITE_GEMINI_API_KEY=paste_key_vào_đây
💾 Lưu file
```

**1.3. Khởi động**
```bash
# Windows: Double-click file
start.bat

# Hoặc dùng terminal:
npm run dev
```

**1.4. Truy cập**
```
🌐 Mở trình duyệt
🔗 Truy cập: http://localhost:3000
```

---

### 📚 Bước 2: Sử dụng Sản phẩm 1 - Hệ thống hóa kiến thức

#### 2.1. Chuẩn bị
- Xác định chủ đề cần hệ thống hóa (VD: "Hệ thống điện quốc gia")
- Chọn đúng lớp (10/11/12)

#### 2.2. Thực hiện
```
1️⃣ Click tab "SP1: Hệ thống hóa"
2️⃣ Chọn lớp: 12
3️⃣ Nhập chủ đề: "Hệ thống điện quốc gia"
4️⃣ Click "Tạo sơ đồ tư duy với AI"
5️⃣ Chờ 10-30 giây
```

#### 2.3. Kết quả nhận được
✅ **Phần 1: Câu hỏi (lệnh) AI**
- Hiển thị ở form nhập liệu
- Copy để đưa vào báo cáo

✅ **Phần 2: Nội dung hệ thống hóa**
- Văn bản chi tiết
- Có YCCĐ theo GDPT 2018
- Cấu trúc logic, khoa học

✅ **Phần 3: Sơ đồ tư duy (Mind Map)**
- Dạng Mermaid diagram
- Trực quan, dễ hiểu
- Có thể screenshot để lưu

#### 2.4. Export kết quả
**Cách 1: Copy/Paste**
- Copy văn bản → Paste vào Word
- Screenshot sơ đồ → Paste vào Word

**Cách 2: In PDF**
- Ctrl + P (Print)
- Chọn "Save as PDF"
- Lưu file

---

### 📝 Bước 3: Sử dụng Sản phẩm 2 - Tạo câu hỏi trắc nghiệm

#### 3.1. Cấu hình đúng yêu cầu
```
Lớp: 12
Số câu 4 lựa chọn: 10
Số câu Đúng/Sai: 2
Chủ đề: (Nhập chủ đề cần tạo câu hỏi)
```

#### 3.2. Thực hiện
```
1️⃣ Click tab "SP2: Câu hỏi TN"
2️⃣ Điền form như trên
3️⃣ Nhập chủ đề: VD "Công nghệ điện và điện tử"
4️⃣ Click "Tạo câu hỏi với AI"
5️⃣ Chờ 20-45 giây
```

#### 3.3. Kết quả nhận được
✅ 10 câu trắc nghiệm 4 lựa chọn
- Phân bổ: 4 câu lớp 10-11, 3 điện, 3 điện tử
- Có YCCĐ rõ ràng
- Có mức độ nhận thức

✅ 2 câu Đúng/Sai
- 1 câu điện, 1 câu điện tử
- Có YCCĐ và mức độ

#### 3.4. Làm bài thử nghiệm
```
✅ Chọn đáp án cho từng câu
✅ Click "Kiểm tra đáp án"
✅ Xem kết quả + Giải thích
```

#### 3.5. Lập bảng phân công (Nếu làm nhóm)
**Tự tạo bảng trong Word:**
```
| STT | Họ tên | Câu 4 lựa chọn | Câu Đúng/Sai |
|-----|--------|----------------|--------------|
| 1   | Nguyễn A | 1, 5, 9      | 11          |
| 2   | Trần B   | 2, 6, 10     | 12          |
| 3   | Lê C     | 3, 7         | -           |
| 4   | Phạm D   | 4, 8         | -           |
```

---

### 🎯 Bước 4: [BONUS] Sử dụng Sản phẩm 3 - Đề thi mô phỏng

#### 4.1. Mục đích
- Luyện đề thi chuẩn THPT (24 câu)
- Tự đánh giá năng lực
- Làm quen format đề thi thật

#### 4.2. Thực hiện
```
1️⃣ Click tab "SP3: Đề thi"
2️⃣ Chọn lớp: 12
3️⃣ Click "Tạo đề thi mô phỏng"
4️⃣ Chờ 30-60 giây
5️⃣ Làm bài (24 câu)
6️⃣ Click "Nộp bài"
7️⃣ Xem kết quả: Điểm số + Thời gian
```

---

## 📊 CÁCH TẠO BÁO CÁO HOÀN CHỈNH

### Cấu trúc file Word chuẩn

```
📄 BÁO CÁO SẢN PHẨM HỌC TẬP

========================================
SẢN PHẨM 1: HỆ THỐNG HÓA KIẾN THỨC
========================================

1. Câu hỏi (lệnh) giao tiếp với AI
----------------------------------
[Copy từ form nhập liệu trên web]

Prompt AI:
"Bạn là chuyên gia biên soạn tài liệu ôn thi...
Chủ đề: Hệ thống điện quốc gia
..."

2. Kết quả phản hồi của AI
--------------------------
[Copy nội dung hệ thống hóa từ web]

✅ Khái niệm và vai trò
✅ Cấu trúc hệ thống
✅ Nguyên lý vận hành
...

3. Sơ đồ tư duy (Mind Map)
--------------------------
[Screenshot sơ đồ từ web và paste vào]

========================================
SẢN PHẨM 2: XÂY DỰNG CÂU HỎI TRẮC NGHIỆM
========================================

1. Hệ thống câu hỏi
-------------------
A. Trắc nghiệm 4 lựa chọn (10 câu)
[Copy từ web]

Câu 1: [Nội dung]
A. ... B. ... C. ... D. ...
Đáp án: ...
YCCĐ: ...
Mức độ: Biết/Hiểu/Vận dụng

B. Trắc nghiệm Đúng/Sai (2 câu)
[Copy từ web]

2. Bảng phân công thành viên
----------------------------
| STT | Họ tên | Câu MC | Câu TF |
|-----|--------|--------|--------|
| ... | ...    | ...    | ...    |

3. Câu hỏi (lệnh) giao tiếp với AI
----------------------------------
[Copy prompt từ web]

4. Nhận xét và đánh giá
-----------------------
✅ AI tạo câu hỏi nhanh, chính xác
✅ Bám sát SGK Cánh Diều
✅ Phân loại YCCĐ rõ ràng
✅ Hỗ trợ ôn thi hiệu quả
...
```

---

## 💡 MẸO & LƯU Ý

### ✅ Để có kết quả tốt nhất:

**Chủ đề nên:**
- ✅ Cụ thể: "Máy biến áp ba pha" thay vì "Điện"
- ✅ Trong SGK Cánh Diều
- ✅ Phù hợp với lớp đã chọn

**Chủ đề tránh:**
- ❌ Quá chung: "Công nghệ"
- ❌ Ngoài chương trình
- ❌ Nhiều chủ đề cùng lúc

### 📝 Ví dụ chủ đề hay (Lớp 12):

**Công nghệ điện:**
- Hệ thống điện quốc gia
- Mạch điện xoay chiều ba pha
- Máy biến áp ba pha
- Động cơ không đồng bộ ba pha
- An toàn điện trong sản xuất

**Công nghệ điện tử:**
- Linh kiện điện tử (Điốt, Transistor)
- Mạch khuếch đại dùng transistor
- IC khuếch đại thuật toán (Op-Amp)
- Mạch dao động đa hài
- Mạch nguồn một chiều

### 🔧 Xử lý sự cố

**Lỗi: "Vui lòng cấu hình API Key"**
→ Kiểm tra file .env.local có đúng API key chưa

**AI trả kết quả không đúng format**
→ Nhấn "Làm mới" và thử lại (AI cần thử nhiều lần)

**Sơ đồ không hiển thị**
→ Làm mới trang (F5) hoặc thử chủ đề khác

---

## 🎯 KẾT QUẢ ĐẠT ĐƯỢC

### Sau khi hoàn thành, bạn có:

✅ **Sản phẩm 1:**
- File báo cáo Word với nội dung hệ thống hóa
- Sơ đồ tư duy trực quan
- Prompt AI đã sử dụng

✅ **Sản phẩm 2:**
- 10 câu trắc nghiệm 4 lựa chọn
- 2 câu Đúng/Sai
- Bảng phân công thành viên
- Đánh giá kết quả

✅ **Thành tích:**
- Hiểu cách ứng dụng AI vào học tập
- Có tài liệu ôn thi chất lượng
- Tiết kiệm thời gian biên soạn

---

## 📞 HỖ TRỢ

**Nếu gặp khó khăn:**
1. Đọc lại file `HUONG_DAN.md`
2. Xem file `README.md` để biết cách cài đặt
3. Kiểm tra file `THAY_DOI.md` để hiểu cấu trúc

**Mọi thắc mắc về kỹ thuật:**
- Kiểm tra console (F12) xem lỗi
- Đảm bảo đã cài Node.js
- Đảm bảo API key hợp lệ

---

**Chúc bạn thành công! 🎓**
