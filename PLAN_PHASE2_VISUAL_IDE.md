# 🚀 PHASE 2: VISUAL LEARNING LAB & ARDUINO SIMULATOR

## 1. TÁI CẤU TRÚC GIAO DIỆN (NEW UI LAYOUT)
Chuyển từ 2 cột sang 3 khu vực chính:
- **Khu vực 1 (Left - 250px)**: **Learning Path Sidebar**.
  - Hiển thị danh sách bài học (Lesson 1, Lesson 2...).
  - Trạng thái: 🔒 Locked, ✅ Completed, 🔵 Current.
- **Khu vực 2 (Center - Flex)**: **Code Editor**.
- **Khu vực 3 (Right - 400px)**: **Interactive Panel**.
  - Tab 1: **Simulator** (Hình ảnh Arduino, Canvas vẽ đồ thị, Console).
  - Tab 2: **AI Mentor** (Chat, Gợi ý, Chấm điểm).

## 2. TÍNH NĂNG MỚI

### A. Lộ trình học thông minh (Curriculum System)
- Dữ liệu bài học được định nghĩa cứng (JSON) cho từng ngôn ngữ:
  - **Python**: Biến -> Vòng lặp -> Hàm -> Xử lý chuỗi.
  - **Arduino**: Blink LED -> Traffic Light -> Button Input -> Serial.
- Mỗi bài học bao gồm:
  - Đề bài (Markdown).
  - Code mẫu (Template).
  - **Gợi ý (Hidden Hints)**: Mảng các gợi ý, mặc định ẩn.

### B. Arduino Visualizer (Giả lập hình ảnh)
Thay vì biên dịch mã máy (quá nặng), ta sẽ dùng phương pháp **Interpreter (Thông dịch logic)**:
1. **Parser**: Đọc code người dùng, tìm các từ khóa (`digitalWrite`, `delay`, `Serial.print`).
2. **Virtual Board**: Một Component React hiển thị ảnh SVG của Arduino Uno.
   - Có các `div` overlay đại diện cho đèn LED (Pin 13, TX, RX).
   - Có đèn LED rời (Breadboard view) cho các bài tập nâng cao.
3. **Execution Loop**:
   - Khi chạy `digitalWrite(13, HIGH)` -> State React cập nhật `led13: true` -> CSS class `bg-red-500 shadow-glow` bật lên.

## 3. CHECKLIST TRIỂN KHAI
- [ ] **Step 1: Data & Sidebar**: Tạo file `curriculumData.ts` và Sidebar lộ trình.
- [ ] **Step 2: UI Refactoring**: Chia lại layout SmartIDE thành 3 phần.
- [ ] **Step 3: Hint System**: Tạo component `HintBox` (mờ đi, click mới hiện).
- [ ] **Step 4: Arduino Simulator**:
    - Tìm/Vẽ SVG Arduino.
    - Viết logic `ArduinoInterpreter` để map code sang hiệu ứng hình ảnh.

---
*Autonomous Tech Lead*