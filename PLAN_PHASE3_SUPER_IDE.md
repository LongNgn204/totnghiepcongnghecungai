# 🚀 PHASE 3: SUPER CODE STUDIO - INTERACTIVE LAB

## 1. MỤC TIÊU
Biến Code Studio thành môi trường thực hành kỹ thuật số toàn diện, nơi học sinh có thể "lắp mạch" ảo và "code" thật.

## 2. TÍNH NĂNG NÂNG CẤP

### A. Arduino Lab V2 (Nâng cao)
- **Thêm linh kiện**:
  - 🔴 Đèn LED rời (Red, Green, Blue).
  - 🎛️ Nút nhấn (Push Button) - Tương tác click chuột.
  - 📟 Màn hình LCD 16x2 (Hiển thị chữ từ code `lcd.print()`).
- **Breadboard View**: Hiển thị sơ đồ đấu nối bên cạnh bo mạch.

### B. Python Interactive Shell
- Hỗ trợ hàm `input()`: Khi code chạy đến `input()`, Terminal sẽ hiện ô nhập liệu cho người dùng.
- Biểu đồ hóa: Nếu code in ra danh sách số, tự động vẽ biểu đồ (Graph) bên cạnh.

### C. Gamification (Hứng thú học tập)
- **Streak**: Chuỗi ngày code liên tục.
- **XP System**: Code chạy đúng +100 XP.
- **Sound Effect**: Âm thanh gõ phím ASMR, âm thanh "Success" khi chạy đúng.

## 3. LỘ TRÌNH TRIỂN KHAI

- [ ] **Step 1: Nâng cấp Arduino Simulator (V2)**
    - Vẽ thêm linh kiện SVG (Button, LCD).
    - Cập nhật Interpreter để hiểu `digitalRead()` và `lcd.print()`.

- [ ] **Step 2: Nâng cấp Python Runner**
    - Xử lý `input()` blocking.
    - Thêm tab "Chart" để visualize dữ liệu.

- [ ] **Step 3: Gamification UI**
    - Thêm thanh Progress Bar, XP Badge vào Header IDE.
    - Thêm hiệu ứng Confetti (pháo hoa) khi hoàn thành bài học.

---
*Autonomous Tech Lead*