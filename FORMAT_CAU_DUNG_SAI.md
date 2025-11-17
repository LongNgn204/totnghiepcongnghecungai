# 📋 FORMAT CÂU HỎI ĐÚNG/SAI MỚI

## 🎯 Mục đích
Cập nhật format câu hỏi Đúng/Sai (Câu 25-28) để hiển thị rõ ràng các đáp án a), b), c), d) thay vì chỉ có 2 nút "Đúng" và "Sai".

## ✅ Format Mới (PHẦN II - Câu 25-28)

### Cấu trúc câu hỏi:

```
Câu 25. [Tình huống/Dữ kiện cụ thể về chủ đề]. Các phát biểu sau đúng hay sai?

a) Phát biểu thứ nhất (câu hoàn chỉnh có nội dung cụ thể)
b) Phát biểu thứ hai (câu hoàn chỉnh có nội dung cụ thể)
c) Phát biểu thứ ba (câu hoàn chỉnh có nội dung cụ thể)
d) Phát biểu thứ tư (câu hoàn chỉnh có nội dung cụ thể)
```

### Đáp án:
- a) ĐÚNG/SAI (Giải thích tại sao)
- b) ĐÚNG/SAI (Giải thích tại sao)
- c) ĐÚNG/SAI (Giải thích tại sao)
- d) ĐÚNG/SAI (Giải thích tại sao)

## 📝 Ví dụ - Công nghệ ĐIỆN

### Câu 25 (Chuyên đề Điện):

**Câu hỏi:**
```
Câu 25. Cho mạch điện xoay chiều RLC mắc nối tiếp, điện áp hiệu dụng U = 200V, R = 30Ω. 
Các phát biểu sau đúng hay sai?

a) Khi xảy ra cộng hưởng, tổng trở của mạch Z = R = 30Ω
b) Công suất tiêu thụ đạt cực đại khi cảm kháng XL bằng dung kháng XC
c) Hệ số công suất cosφ = 1 tại tần số cộng hưởng
d) Điện áp hiệu dụng trên điện trở R luôn nhỏ hơn điện áp nguồn U
```

**Đáp án:**
- a) **ĐÚNG** - Tại cộng hưởng XL = XC nên Z = √(R² + 0²) = R = 30Ω
- b) **ĐÚNG** - Pmax = U²/R đạt được khi Z = R (điều kiện cộng hưởng)
- c) **ĐÚNG** - Tại cộng hưởng φ = 0° nên cosφ = cos(0°) = 1
- d) **SAI** - Tại cộng hưởng UR = U = 200V (vì I = U/R và UR = I·R = U)

## 📝 Ví dụ - Công nghệ NÔNG NGHIỆP

### Câu 25 (Trồng trọt):

**Câu hỏi:**
```
Câu 25. Cho các phát biểu về kỹ thuật canh tác lúa nước theo quy trình VietGAP ở Đồng bằng sông Cửu Long. 
Các phát biểu sau đúng hay sai?

a) Giống lúa F1 lai có năng suất cao hơn giống thuần từ 15-20% nhờ ưu thế lai
b) Mật độ gieo sạ nên đạt 250-300 hạt/m² để tăng năng suất tối đa
c) Giai đoạn làm đòng (trổ bông và chín sữa) là thời kỳ cần tưới nước nhiều nhất
d) Phân đạm nên bón toàn bộ một lần vào lúc bón lót để cây hấp thụ tốt
```

**Đáp án:**
- a) **ĐÚNG** - Lúa F1 lai có ưu thế lai vượt trội về năng suất theo SGK Kết nối tri thức
- b) **SAI** - Mật độ quá dày làm cây chống đổ, sâu bệnh phát triển. Nên gieo 100-120 hạt/m²
- c) **ĐÚNG** - Đòng nước là giai đoạn tiêu hao nước lớn nhất, thiếu nước giảm năng suất nghiêm trọng
- d) **SAI** - Phân đạm phải chia 2-3 lần: lót (40%), trước đẻ nhánh (30%), trước trổ (30%)

## 🔧 Thay đổi kỹ thuật

### 1. Types.ts - Thêm interface mới:

```typescript
export interface QuestionTF {
  id: number;
  question: string;
  answer: boolean; // Giữ lại cho tương thích
  requirement: string;
  level: QuestionLevel;
  // Format mới:
  statements?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answers?: {
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
  };
  explanations?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}
```

### 2. QuestionCard.tsx - Hiển thị mới:

Thay vì hiển thị 2 nút "Đúng/Sai", giờ hiển thị:
- Box xanh chứa 4 phát biểu a), b), c), d)
- Mỗi phát biểu hiển thị rõ nội dung
- Khi submit: Hiển thị badge "ĐÚNG" (xanh) hoặc "SAI" (đỏ)
- Hiển thị giải thích chi tiết cho từng phát biểu

### 3. Product3.tsx & Product4.tsx - Prompt AI:

Cập nhật prompt yêu cầu AI tạo câu Đúng/Sai với format:
```json
{
  "id": 25,
  "type": "tf",
  "question": "Câu 25. Cho mạch điện... Các phát biểu sau đúng hay sai?\na) ...\nb) ...\nc) ...\nd) ...",
  "statements": {
    "a": "Phát biểu a",
    "b": "Phát biểu b",
    "c": "Phát biểu c",
    "d": "Phát biểu d"
  },
  "answers": {
    "a": true,
    "b": false,
    "c": true,
    "d": false
  },
  "explanations": {
    "a": "ĐÚNG - Giải thích...",
    "b": "SAI - Giải thích...",
    "c": "ĐÚNG - Giải thích...",
    "d": "SAI - Giải thích..."
  }
}
```

## 🎨 Giao diện mới

### Trước khi submit:
```
┌─────────────────────────────────────────────┐
│ Câu 25                            [Thông hiểu]│
│                                               │
│ Cho mạch điện... Các phát biểu sau đúng      │
│ hay sai?                                      │
│                                               │
│ 📝 Xác định các phát biểu sau đúng hay sai:  │
│ ┌───────────────────────────────────────┐   │
│ │ a) Phát biểu thứ nhất...              │   │
│ ├───────────────────────────────────────┤   │
│ │ b) Phát biểu thứ hai...               │   │
│ ├───────────────────────────────────────┤   │
│ │ c) Phát biểu thứ ba...                │   │
│ ├───────────────────────────────────────┤   │
│ │ d) Phát biểu thứ tư...                │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Sau khi submit:
```
┌─────────────────────────────────────────────┐
│ Câu 25                            [Thông hiểu]│
│                                               │
│ 📝 Xác định các phát biểu sau đúng hay sai:  │
│ ┌───────────────────────────────────────┐   │
│ │ a) Phát biểu thứ nhất...        [ĐÚNG]│   │
│ │ ✅ ĐÚNG - Giải thích chi tiết...      │   │
│ ├───────────────────────────────────────┤   │
│ │ b) Phát biểu thứ hai...          [SAI]│   │
│ │ ❌ SAI - Giải thích chi tiết...       │   │
│ ├───────────────────────────────────────┤   │
│ │ c) Phát biểu thứ ba...          [ĐÚNG]│   │
│ │ ✅ ĐÚNG - Giải thích chi tiết...      │   │
│ ├───────────────────────────────────────┤   │
│ │ d) Phát biểu thứ tư...           [SAI]│   │
│ │ ❌ SAI - Giải thích chi tiết...       │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## ✅ Lợi ích

1. **Rõ ràng hơn**: Hiển thị đầy đủ 4 đáp án a, b, c, d thay vì chỉ 2 nút
2. **Chuẩn đề thi**: Đúng format THPT Quốc Gia (mỗi câu Đúng/Sai có 4 phát biểu)
3. **Dễ học**: Học sinh thấy rõ từng phát biểu và giải thích chi tiết
4. **Trực quan**: Màu xanh (ĐÚNG), màu đỏ (SAI) dễ phân biệt

## 🚀 Triển khai

✅ Đã hoàn thành:
- [x] Cập nhật Types (types.ts)
- [x] Cập nhật UI Component (QuestionCard.tsx)
- [x] Cập nhật Prompt AI (Product3.tsx - Công nghiệp)
- [x] Cập nhật Prompt AI (Product4.tsx - Nông nghiệp)
- [x] Thêm ví dụ mẫu trong prompt
- [x] Zero compilation errors

🎯 Cách sử dụng:
1. Chọn chuyên đề (Điện/Điện tử hoặc Trồng trọt/Chăn nuôi)
2. Tạo đề thi
3. AI sẽ tạo câu 25-28 với format mới (4 phát biểu a, b, c, d)
4. Làm bài và xem kết quả chi tiết

---

**Ngày cập nhật:** 17/11/2025  
**Phiên bản:** 2.0 - Format câu Đúng/Sai cải tiến
