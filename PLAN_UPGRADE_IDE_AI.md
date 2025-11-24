# 🚀 KẾ HOẠCH NÂNG CẤP: SMART AI IDE & CODE TUTOR

## 1. MỤC TIÊU
Xây dựng môi trường Lập trình tích hợp (IDE) ngay trên trình duyệt, cho phép học sinh:
- Code Python, C++, Web (HTML/CSS/JS) và **Arduino**.
- Chạy code và xem kết quả ngay lập tức (Real-time Execution).
- **AI Coding Mentor**: Theo dõi từng dòng code, gợi ý khi bí, và chấm điểm chi tiết.

## 2. KIẾN TRÚC KỸ THUẬT (TECH STACK)

### A. Core Editor (Trái tim của IDE)
- **Engine**: `Monaco Editor` (Cùng lõi với VS Code).
- **Tính năng**: Highlight cú pháp, Auto-complete, Error checking, Mini-map.

### B. Execution Engine (Bộ máy chạy code)
1. **Python**: Sử dụng **Pyodide** (WebAssembly) để chạy Python trực tiếp trên trình duyệt học sinh (Nhanh, không tốn server).
2. **Web (HTML/CSS/JS)**: Iframe Sandbox (An toàn, preview trực tiếp).
3. **C++/Java**: Sử dụng API Compiler (Judge0 hoặc Piston API) hoặc WebAssembly (nếu có thể tối ưu).
4. **Arduino**: 
   - **Phương án 1 (Giả lập)**: Sử dụng `avr8js` để mô phỏng chip AVR (Arduino Uno) chạy trên JS. Có thể giả lập đèn LED nhấp nháy.
   - **Phương án 2 (Biên dịch)**: Gửi code lên server biên dịch ra file `.hex`, sau đó mô phỏng logic.

### C. AI Mentor Integration (Trí tuệ nhân tạo)
Sử dụng Gemini Pro 1.5 với chế độ "Instructor Persona" (Giáo viên):
1. **Real-time Hint (Gợi ý)**:
   - Input: Code hiện tại + Đề bài + Lỗi đang gặp.
   - Output: Gợi ý hướng giải quyết (KHÔNG đưa lời giải ngay).
2. **Code Review (Chấm bài)**:
   - Input: Code hoàn thiện.
   - Output: 
     - ✅ Correctness (Đúng/Sai).
     - 🚀 Performance (Tối ưu chưa?).
     - 🧹 Clean Code (Đặt tên biến, format).
     - 💡 Tips (Mẹo hay hơn).

## 3. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

### Phase 1: Xây dựng Smart IDE (Cơ bản)
- [ ] Tích hợp `Monaco Editor`.
- [ ] Xây dựng Layout 3 phần: [Đề bài] - [Editor] - [Terminal/Preview].
- [ ] Chạy được code Python cơ bản (Print, Loop, Variable).

### Phase 2: AI Integration (Gắn não cho IDE)
- [ ] Thêm nút "Gợi ý cho tôi" (AI phân tích code dở dang -> Gợi ý).
- [ ] Thêm nút "Nộp bài & Chấm điểm" (AI chấm theo rubric).
- [ ] Hiển thị nhận xét của AI dưới dạng Comment trực tiếp vào dòng code (Inline Comments).

### Phase 3: Arduino & Advanced Features
- [ ] Tích hợp trình giả lập Arduino cơ bản (LED Blink).
- [ ] Hệ thống bài tập theo lộ trình (Gamification - Unlock từng bài).

## 4. GIAO DIỆN (UI/UX)
- Giữ phong cách **Trắng & Cam** hiện đại.
- Editor có Theme sáng (phù hợp app) và tối (cho pro coder).
- Panel AI Mentor sẽ nằm bên phải hoặc dạng Pop-up thông minh.

---
*Created by Autonomous Tech Lead*