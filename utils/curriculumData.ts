export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: 'python' | 'arduino' | 'cpp' | 'javascript';
  templateCode: string;
  hints: string[]; 
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category?: string; 
  simulationMode?: 'default' | 'traffic' | 'sensor' | 'button' | 'buzzer' | 'lcd' | 'servo';
}

export const CURRICULUM: Record<string, Lesson[]> = {
  python: [
    // MODULE 0: KHỞI ĐỘNG
    {
      id: 'py_00_1',
      title: 'Bài 0: Làm quen với Code Studio',
      description: 'Học cách viết dòng code đầu tiên và chạy chương trình.',
      language: 'python',
      difficulty: 'Easy',
      category: 'Module 0: Khởi động',
      templateCode: `# Đây là nơi bạn viết code
# Dòng này là bình luận (máy tính sẽ bỏ qua)

print("Chào mừng đến với Code Studio!")
print("Bấm nút 'Run' để xem kết quả nhé -->")
`,
      hints: [
        'Nút Run màu xanh lá cây ở góc trên bên phải.',
        'Kết quả sẽ hiện ra ở màn hình đen (Terminal) bên dưới.'
      ]
    },
    {
      id: 'py_00_2',
      title: 'Sửa lỗi cú pháp (Syntax Error)',
      description: 'Máy tính rất kỹ tính. Hãy thử sửa lỗi trong đoạn code sau.',
      language: 'python',
      difficulty: 'Easy',
      category: 'Module 0: Khởi động',
      templateCode: `# Code này đang bị lỗi. Bạn có tìm ra không?
print("Dòng này đúng")
print("Dòng này thiếu ngoặc đóng"
print("Dòng này cũng sai")
`,
      hints: [
        'Hàm print bắt buộc phải có cặp ngoặc tròn ( ).',
        'Thêm dấu đóng ngoặc ) vào cuối dòng thứ 3.'
      ]
    },

    // MODULE 1: NHẬP MÔN
    {
      id: 'py_01',
      title: 'Bài 1: Xin chào Python',
      description: 'Làm quen với lệnh print() để in thông điệp ra màn hình.',
      language: 'python',
      difficulty: 'Easy',
      category: 'Module 1: Nhập Môn',
      templateCode: `# Nhiệm vụ: In ra dòng chữ "Xin chào các bạn!"
print("...")
`,
      hints: [
        'Dùng hàm print("nội dung") để in.',
        'Đừng quên dấu ngoặc kép bao quanh chuỗi văn bản.',
      ]
    },
    {
      id: 'py_02',
      title: 'Bài 2: Biến số (Hộp chứa)',
      description: 'Tạo biến lưu tên và tuổi của bạn.',
      language: 'python',
      difficulty: 'Easy',
      category: 'Module 1: Nhập Môn',
      templateCode: `# Tạo biến ten và tuoi
ten = "Nguyễn Văn A"
tuoi = 16

# In ra câu: "Tôi tên là ..., năm nay ... tuổi"
print(f"Tôi tên là {ten}, năm nay {tuoi} tuổi")
`,
      hints: [
        'Biến giúp lưu trữ giá trị để dùng lại sau này.',
        'Dùng f-string (f"...") để chèn biến vào chuỗi dễ dàng hơn.',
      ]
    },
    {
      id: 'py_03',
      title: 'Bài 3: Máy tính bỏ túi',
      description: 'Thực hiện các phép tính cộng, trừ, nhân, chia.',
      language: 'python',
      difficulty: 'Easy',
      category: 'Module 1: Nhập Môn',
      templateCode: `a = 10
b = 5

tong = a + b
hieu = a - b
tich = a * b
thuong = a / b

print("Tổng:", tong)
# Hãy in ra Hiệu, Tích và Thương tương tự
`,
      hints: [
        'Phép nhân dùng dấu *',
        'Phép chia dùng dấu /',
      ]
    },

    // MODULE 2: ĐIỀU KHIỂN LUỒNG
    {
      id: 'py_04',
      title: 'Bài 4: Kiểm tra Đậu/Rớt (If-Else)',
      description: 'Viết chương trình kiểm tra điểm thi.',
      language: 'python',
      difficulty: 'Medium',
      category: 'Module 2: Logic & Vòng lặp',
      templateCode: `diem_thi = 7.5

# Nếu điểm >= 5 thì Đậu, ngược lại thì Rớt
if diem_thi >= 5:
    print("Chúc mừng! Bạn đã Đậu.")
else:
    # Viết code xử lý trường hợp rớt ở đây
`,
      hints: [
        'Dùng từ khóa else: để xử lý trường hợp ngược lại.',
        'Nhớ thụt đầu dòng (indentation) cho các dòng lệnh bên trong if/else.',
      ]
    },
    {
      id: 'py_05',
      title: 'Bài 5: Bảng cửu chương (Vòng lặp For)',
      description: 'In ra bảng cửu chương 5 bằng vòng lặp.',
      language: 'python',
      difficulty: 'Medium',
      category: 'Module 2: Logic & Vòng lặp',
      templateCode: `# In bảng cửu chương 5
so = 5

for i in range(1, 11):
    # i sẽ chạy từ 1 đến 10
    ket_qua = so * i
    print(f"{so} x {i} = {ket_qua}")
`,
      hints: [
        'Hàm range(1, 11) tạo ra dãy số từ 1 đến 10.',
        'Mỗi lần lặp, biến i sẽ nhận một giá trị mới.',
      ]
    },
    {
      id: 'py_06',
      title: 'Bài 6: Tính tổng dãy số (Vòng lặp While)',
      description: 'Tính tổng các số từ 1 đến n.',
      language: 'python',
      difficulty: 'Medium',
      category: 'Module 2: Logic & Vòng lặp',
      templateCode: `n = 10
tong = 0
i = 1

while i <= n:
    tong = tong + i
    i = i + 1

print(f"Tổng từ 1 đến {n} là: {tong}")
`,
      hints: [
        'Vòng lặp while chạy mãi cho đến khi điều kiện sai.',
        'Đừng quên tăng biến i (i = i + 1) để tránh vòng lặp vô hạn.',
      ]
    },

    // MODULE 3: CẤU TRÚC DỮ LIỆU
    {
      id: 'py_07',
      title: 'Bài 7: Danh sách học sinh (List)',
      description: 'Quản lý danh sách tên học sinh trong lớp.',
      language: 'python',
      difficulty: 'Medium',
      category: 'Module 3: Dữ liệu',
      templateCode: `hoc_sinh = ["An", "Bình", "Chi", "Dũng"]

# 1. In ra tên bạn đầu tiên
print("Bạn đầu tiên:", hoc_sinh[0])

# 2. Thêm một bạn mới vào cuối danh sách
hoc_sinh.append("Em")

# 3. In ra tổng số học sinh
print("Sĩ số lớp:", len(hoc_sinh))

# 4. In toàn bộ danh sách
print(hoc_sinh)
`,
      hints: [
        'Chỉ số danh sách bắt đầu từ 0.',
        'Hàm len() trả về độ dài danh sách.',
        'Hàm append() thêm phần tử vào cuối.',
      ]
    },
    {
      id: 'py_08',
      title: 'Bài 8: Từ điển Anh-Việt (Dictionary)',
      description: 'Tra cứu từ vựng đơn giản.',
      language: 'python',
      difficulty: 'Hard',
      category: 'Module 3: Dữ liệu',
      templateCode: `tu_dien = {
    "hello": "xin chào",
    "cat": "con mèo",
    "dog": "con chó",
    "school": "trường học"
}

tu_can_tra = "cat"

if tu_can_tra in tu_dien:
    nghia = tu_dien[tu_can_tra]
    print(f"{tu_can_tra} nghĩa là: {nghia}")
else:
    print("Không tìm thấy từ này.")
`,
      hints: [
        'Dictionary lưu dữ liệu dạng Key: Value.',
        'Dùng toán tử in để kiểm tra khóa có tồn tại không.',
      ]
    },

    // MODULE 4: DỰ ÁN THỰC TẾ
    {
      id: 'py_project_1',
      title: 'Dự án 1: Game Đoán Số',
      description: 'Máy tính chọn một số ngẫu nhiên, bạn phải đoán xem đó là số mấy.',
      language: 'python',
      difficulty: 'Hard',
      category: 'Module 4: Dự án Thực tế',
      templateCode: `import random

so_bi_mat = random.randint(1, 10)
print("Máy tính đã chọn một số từ 1 đến 10. Hãy đoán xem!")

du_doan = 5 # Thử thay đổi số này để đoán

if du_doan == so_bi_mat:
    print("CHÚC MỪNG! Bạn đã đoán đúng.")
elif du_doan < so_bi_mat:
    print("Sai rồi. Số bí mật LỚN hơn.")
else:
    print("Sai rồi. Số bí mật NHỎ hơn.")

print("Số bí mật là:", so_bi_mat)
`,
      hints: [
        'Thư viện random giúp tạo số ngẫu nhiên.',
        'Logic game: So sánh số dự đoán với số bí mật.',
      ]
    },
    {
      id: 'py_project_2',
      title: 'Dự án 2: Quản lý chi tiêu',
      description: 'Tính tổng tiền đã chi tiêu trong tuần.',
      language: 'python',
      difficulty: 'Hard',
      category: 'Module 4: Dự án Thực tế',
      templateCode: `chi_tieu = {
    "Thứ 2": 50000,
    "Thứ 3": 30000,
    "Thứ 4": 45000,
    "Thứ 5": 60000,
    "Thứ 6": 20000
}

tong_tien = 0

print("--- NHẬT KÝ CHI TIÊU ---")
for ngay, tien in chi_tieu.items():
    print(f"{ngay}: {tien} VNĐ")
    tong_tien += tien

print("------------------------")
print(f"TỔNG CỘNG: {tong_tien} VNĐ")
`,
      hints: [
        'Dùng vòng lặp for để duyệt qua từng mục trong Dictionary.',
        'Cộng dồn tiền vào biến tong_tien.',
      ]
    }
  ],
  
  // ARDUINO CURRICULUM
  arduino: [
    // MODULE 0: KHỞI ĐỘNG
    {
      id: 'ard_00_1',
      title: 'Bài 0: Cấu trúc Arduino',
      description: 'Tìm hiểu setup() và loop() là gì.',
      language: 'arduino',
      difficulty: 'Easy',
      category: 'Module 0: Khởi động',
      simulationMode: 'default',
      templateCode: `// 1. setup() chạy MỘT LẦN khi khởi động
void setup() {
  // Thường dùng để cài đặt pin, khởi động Serial...
  // Hãy thử xóa dòng này xem sao?
}

// 2. loop() chạy LẶP LẠI MÃI MÃI
void loop() {
  // Code chính viết ở đây
  
}
`,
      hints: [
        'Nếu thiếu setup() hoặc loop(), chương trình sẽ báo lỗi.',
        'Arduino luôn chạy từ trên xuống dưới, hết loop lại quay lại đầu loop.'
      ]
    },

    // MODULE 1: CƠ BẢN
    {
      id: 'ard_01',
      title: 'Bài 1: Blink LED (Hello World)',
      description: 'Làm đèn LED tích hợp (Pin 13) nhấp nháy mỗi 1 giây.',
      language: 'arduino',
      difficulty: 'Easy',
      category: 'Module 1: Điện tử cơ bản',
      simulationMode: 'default',
      templateCode: `// Bài 1: Làm đèn LED 13 nhấp nháy

void setup() {
  // Cài đặt chân 13 là OUTPUT (đầu ra)
  pinMode(13, OUTPUT);
}

void loop() {
  // Bật đèn
  digitalWrite(13, HIGH);
  delay(1000); // Chờ 1 giây
  
  // Tắt đèn (Hãy viết code ở dưới)
  
}
`,
      hints: [
        'Dùng digitalWrite(13, LOW) để tắt đèn.',
        'Đừng quên thêm delay(1000) sau khi tắt đèn để mắt có thể nhìn thấy.',
      ]
    },
    {
      id: 'ard_02',
      title: 'Bài 2: Đèn giao thông',
      description: 'Mô phỏng đèn giao thông: Đỏ -> Vàng -> Xanh.',
      language: 'arduino',
      difficulty: 'Medium',
      category: 'Module 1: Điện tử cơ bản',
      simulationMode: 'traffic',
      templateCode: `// Đỏ = 13, Vàng = 12, Xanh = 11
void setup() {
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);
}

void loop() {
  // 1. Đèn Đỏ (3s)
  digitalWrite(13, HIGH);
  delay(3000);
  digitalWrite(13, LOW);

  // 2. Đèn Vàng (1s) - Hãy viết tiếp
  
  // 3. Đèn Xanh (3s)
}
`,
      hints: [
        'Bật Vàng (12) -> Delay 1000 -> Tắt Vàng',
        'Bật Xanh (11) -> Delay 3000 -> Tắt Xanh'
      ]
    },

    // MODULE 2: ĐẦU VÀO & TƯƠNG TÁC
    {
      id: 'ard_04',
      title: 'Bài 3: Điều khiển bằng Nút Nhấn',
      description: 'Nhấn nút (Pin 2) để bật đèn LED (Pin 13).',
      language: 'arduino',
      difficulty: 'Medium',
      category: 'Module 2: Tương tác',
      simulationMode: 'button',
      templateCode: `// Nút nhấn nối Pin 2
// Đèn LED nối Pin 13

void setup() {
  pinMode(2, INPUT_PULLUP); // Nút nhấn (kích hoạt điện trở kéo lên)
  pinMode(13, OUTPUT);      // Đèn LED
}

void loop() {
  // Đọc trạng thái nút nhấn (LOW = nhấn, HIGH = thả)
  int buttonState = digitalRead(2);
  
  if (buttonState == LOW) {
    // Nếu nhấn nút -> Bật đèn
    digitalWrite(13, HIGH);
  } else {
    // Ngược lại -> Tắt đèn
    
  }
}
`,
      hints: [
        'Dùng digitalRead(2) để đọc tín hiệu.',
        'INPUT_PULLUP nghĩa là khi nhấn nút giá trị sẽ là LOW (0).',
      ]
    },

    // MODULE 3: CẢM BIẾN & HIỂN THỊ
    {
      id: 'ard_05',
      title: 'Bài 4: Còi báo động (Buzzer)',
      description: 'Phát ra âm thanh cảnh báo.',
      language: 'arduino',
      difficulty: 'Easy',
      category: 'Module 3: Cảm biến & Hiển thị',
      simulationMode: 'buzzer',
      templateCode: `// Còi Buzzer nối Pin 8

void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  // Phát nốt nhạc (Tần số 1000Hz, trong 500ms)
  tone(8, 1000, 500);
  delay(1000);
  
  // Thử đổi tần số khác xem sao?
}
`,
      hints: [
        'Hàm tone(pin, frequency, duration) dùng để phát âm thanh.',
        'Tần số càng cao âm thanh càng bổng.',
      ]
    },
    {
      id: 'ard_06',
      title: 'Bài 5: Màn hình LCD',
      description: 'Hiển thị dòng chữ "Xin Chao" lên màn hình LCD 16x2.',
      language: 'arduino',
      difficulty: 'Medium',
      category: 'Module 3: Cảm biến & Hiển thị',
      simulationMode: 'lcd',
      templateCode: `#include <LiquidCrystal_I2C.h>

// Khởi tạo LCD địa chỉ 0x27, 16 cột 2 dòng
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();      // Khởi động LCD
  lcd.backlight(); // Bật đèn nền
  
  // In ra màn hình
  lcd.setCursor(0, 0); // Cột 0, Dòng 0
  lcd.print("Xin Chao!");
}

void loop() {
  // Không cần làm gì trong loop
}
`,
      hints: [
        'Dùng lcd.setCursor(cột, dòng) để chọn vị trí in.',
        'Dòng 2 bắt đầu từ lcd.setCursor(0, 1).',
      ]
    },

    // MODULE 4: ĐỘNG CƠ & ROBOTICS
    {
      id: 'ard_07',
      title: 'Bài 6: Điều khiển Servo',
      description: 'Xoay cánh tay robot (Servo) từ 0 đến 180 độ.',
      language: 'arduino',
      difficulty: 'Hard',
      category: 'Module 4: Robotics',
      simulationMode: 'servo',
      templateCode: `#include <Servo.h>

Servo myservo;  // Tạo đối tượng servo

void setup() {
  myservo.attach(9);  // Servo nối Pin 9
}

void loop() {
  // Xoay sang 0 độ
  myservo.write(0);
  delay(1000);
  
  // Xoay sang 90 độ
  myservo.write(90);
  delay(1000);
  
  // Xoay sang 180 độ
  myservo.write(180);
  delay(1000);
}
`,
      hints: [
        'Servo chỉ xoay được từ 0 đến 180 độ.',
        'Hàm write(góc) dùng để điều khiển góc quay.',
      ]
    },
    // MODULE 5: DỰ ÁN THỰC TẾ
    {
      id: 'ard_project_1',
      title: 'Dự án 1: Đèn ngủ thông minh',
      description: 'Giả lập: Nếu trời tối (giá trị cảm biến < 500) thì bật đèn.',
      language: 'arduino',
      difficulty: 'Hard',
      category: 'Module 5: Dự án Thực tế',
      simulationMode: 'sensor',
      templateCode: `// Giả sử cảm biến ánh sáng nối chân A0
// Đèn nối chân 13

void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Đọc giá trị cảm biến (Giả lập)
  // Trong thực tế: int light = analogRead(A0);
  int light = 400; // Giả sử trời đang tối
  
  Serial.print("Độ sáng: ");
  Serial.println(light);
  
  if (light < 500) {
    // Trời tối -> Bật đèn
    digitalWrite(13, HIGH);
  } else {
    // Trời sáng -> Tắt đèn
    digitalWrite(13, LOW);
  }
  
  delay(1000);
}
`,
      hints: [
        'analogRead() đọc giá trị từ 0 đến 1023.',
        'Dùng if/else để so sánh giá trị và điều khiển đèn.',
      ]
    }
  ]
};