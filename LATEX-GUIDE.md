# 📐 Hướng Dẫn Công Thức Toán Học với LaTeX

## ✨ Tổng Quan
Website hiện đã hỗ trợ **KaTeX** để hiển thị công thức toán học đẹp mắt và chính xác!

---

## 🎯 CÚ PHÁP CÁC BẢN

### 1. Công Thức Inline (trong dòng)
Sử dụng `$...$` để viết công thức trong câu văn.

**Ví dụ:**
```
Công suất điện: $P = UI$
Điện trở: $R = \frac{\rho L}{S}$
```

**Kết quả:** Công suất điện: $P = UI$, Điện trở: $R = \frac{\rho L}{S}$

---

### 2. Công Thức Block (khối riêng)
Sử dụng `$$...$$` để hiển thị công thức riêng biệt, căn giữa.

**Ví dụ:**
```
$$P = UI = I^2R = \frac{U^2}{R}$$

$$\eta = \frac{P_{out}}{P_{in}} \times 100\%$$
```

**Kết quả:** Công thức sẽ hiển thị to, rõ ràng, căn giữa trang.

---

## 📝 CÁC KÝ HIỆU THƯỜNG DÙNG

### 3.1. Phép Toán Cơ Bản
| Ký hiệu | LaTeX | Kết quả |
|---------|-------|---------|
| Nhân | `$a \times b$` hoặc `$a \cdot b$` | $a \times b$ |
| Chia | `$a \div b$` hoặc `$\frac{a}{b}$` | $a \div b$ |
| Phân số | `$\frac{a}{b}$` | $\frac{a}{b}$ |
| Căn bậc 2 | `$\sqrt{x}$` | $\sqrt{x}$ |
| Căn bậc n | `$\sqrt[n]{x}$` | $\sqrt[n]{x}$ |
| Mũ | `$x^2$`, `$x^{10}$` | $x^2$, $x^{10}$ |
| Chỉ số dưới | `$x_1$`, `$x_{12}$` | $x_1$, $x_{12}$ |

### 3.2. Ký Hiệu Vật Lý
| Ký hiệu | LaTeX | Mô tả |
|---------|-------|-------|
| $\Omega$ | `$\Omega$` | Ohm (đơn vị điện trở) |
| $\Delta$ | `$\Delta$` | Delta (độ biến thiên) |
| $\pi$ | `$\pi$` | Pi |
| $\alpha$ | `$\alpha$` | Alpha |
| $\beta$ | `$\beta$` | Beta |
| $\gamma$ | `$\gamma$` | Gamma |
| $\theta$ | `$\theta$` | Theta (góc) |
| $\lambda$ | `$\lambda$` | Lambda (bước sóng) |
| $\mu$ | `$\mu$` | Mu (hệ số ma sát) |
| $\rho$ | `$\rho$` | Rho (điện trở suất) |
| $\eta$ | `$\eta$` | Eta (hiệu suất) |
| $\omega$ | `$\omega$` | Omega (tần số góc) |

### 3.3. Ký Hiệu So Sánh
| Ký hiệu | LaTeX | Kết quả |
|---------|-------|---------|
| Nhỏ hơn hoặc bằng | `$\leq$` | $\leq$ |
| Lớn hơn hoặc bằng | `$\geq$` | $\geq$ |
| Xấp xỉ | `$\approx$` | $\approx$ |
| Cộng trừ | `$\pm$` | $\pm$ |
| Nhân | `$\times$` | $\times$ |
| Chia | `$\div$` | $\div$ |

### 3.4. Dấu Ngoặc & Định Dạng
| Cú pháp | LaTeX | Kết quả |
|---------|-------|---------|
| Ngoặc đơn | `$(a + b)$` | $(a + b)$ |
| Ngoặc vuông | `$[a + b]$` | $[a + b]$ |
| Ngoặc nhọn | `$\{a + b\}$` | $\{a + b\}$ |
| Ngoặc tự động | `$\left(\frac{a}{b}\right)$` | $\left(\frac{a}{b}\right)$ |

---

## ⚡ VÍ DỤ CÔNG THỨC ĐIỆN - ĐIỆN TỬ

### Định Luật Ohm:
```latex
$$U = IR$$
$$I = \frac{U}{R}$$
$$R = \frac{U}{I}$$
```

### Công Suất Điện:
```latex
$$P = UI$$
$$P = I^2R$$
$$P = \frac{U^2}{R}$$
```

### Điện Trở Suất:
```latex
$$R = \rho \frac{L}{S}$$
```
Trong đó:
- $R$: Điện trở ($\Omega$)
- $\rho$: Điện trở suất ($\Omega \cdot m$)
- $L$: Chiều dài dây dẫn ($m$)
- $S$: Tiết diện ($m^2$)

### Định Luật Jun-Lenxơ:
```latex
$$Q = I^2Rt$$
$$Q = UIt$$
```

### Hiệu Suất:
```latex
$$\eta = \frac{P_{out}}{P_{in}} \times 100\%$$
$$\eta = \frac{P_{ci}}{P_{tp}} \times 100\%$$
```

### Công Thức Biến Áp:
```latex
$$\frac{U_1}{U_2} = \frac{n_1}{n_2} = \frac{I_2}{I_1}$$
```

---

## 🌾 VÍ DỤ CÔNG THỨC NÔNG NGHIỆP

### Năng Suất:
```latex
$$NS = \frac{W}{S}$$
```
Trong đó:
- $NS$: Năng suất (tạ/ha)
- $W$: Tổng sản lượng (tạ)
- $S$: Diện tích (ha)

### Tỷ Lệ Phần Trăm:
```latex
$$\text{Tỷ lệ} = \frac{a}{b} \times 100\%$$
```

### Tốc Độ Tăng Trưởng:
```latex
$$v = \frac{\Delta h}{\Delta t}$$
```

---

## 🎓 VÍ DỤ BÀI TOÁN CỤ THỂ

### Bài Toán 1: Tính Công Suất
**Đề:** Một bóng đèn có điện trở $R = 220\Omega$, hiệu điện thế $U = 220V$. Tính công suất tiêu thụ?

**Giải:**
```latex
$$P = \frac{U^2}{R} = \frac{220^2}{220} = \frac{48400}{220} = 220W$$
```

### Bài Toán 2: Định Luật Ohm
**Đề:** Mạch điện có $U = 12V$, $R = 6\Omega$. Tính cường độ dòng điện?

**Giải:**
```latex
$$I = \frac{U}{R} = \frac{12}{6} = 2A$$
```

### Bài Toán 3: Điện Năng Tiêu Thụ
**Đề:** Bóng đèn $P = 100W$ sử dụng $t = 5h$. Tính điện năng?

**Giải:**
```latex
$$A = Pt = 100 \times 5 = 500Wh = 0.5kWh$$
```

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### Khi Hỏi AI:
1. **Yêu cầu rõ ràng:** "Hãy giải thích công thức Ohm với LaTeX"
2. **Đề bài cụ thể:** "Cho $U = 220V$, $R = 110\Omega$, tính $P$?"
3. **AI sẽ tự động format:** Gemini đã được hướng dẫn sử dụng LaTeX

### Khi Tạo Đề Thi:
- AI tự động dùng LaTeX cho tất cả công thức
- Công thức hiển thị đẹp trong đề thi
- In ra vẫn giữ nguyên format chính xác

---

## ⚠️ LƯU Ý QUAN TRỌNG

### DO's ✅
- Luôn dùng `$` cho inline math
- Luôn dùng `$$` cho block math
- Dùng `\frac{}{}`  cho phân số
- Dùng `^` cho mũ, `_` cho chỉ số dưới
- Dùng `\times` thay vì *
- Dùng `\cdot` cho dấu nhân nhỏ

### DON'Ts ❌
- Không dùng Unicode symbols (√, ², ³) - dùng LaTeX
- Không viết $2 ^ 2$ (có dấu cách) - phải $2^2$
- Không quên dấu `\` trước các lệnh đặc biệt
- Không dùng {} cho đơn ký tự: `$x^2$` ✅, `$x^{2}$` ✅

---

## 📚 TÀI LIỆU THAM KHẢO

### Công Thức Thường Dùng - Copy & Paste:

```latex
# Điện học cơ bản
$U = IR$
$P = UI$
$R = \rho \frac{L}{S}$
$Q = I^2Rt$

# Phân số & căn
$\frac{a}{b}$
$\sqrt{x}$
$\sqrt[3]{x}$

# Chỉ số
$x^2$, $x_1$, $x_{12}$

# Ký hiệu Hy Lạp
$\alpha$, $\beta$, $\gamma$, $\Delta$, $\theta$, $\lambda$, $\pi$, $\rho$, $\eta$, $\omega$, $\Omega$

# So sánh
$\leq$, $\geq$, $\approx$, $\pm$

# Ngoặc tự động
$\left( \frac{a}{b} \right)$
```

---

## 🎯 KẾT LUẬN

Với KaTeX, tất cả công thức toán học giờ đây hiển thị **CHÍNH XÁC, ĐẸP MẮT và CHUYÊN NGHIỆP** như sách giáo khoa! 📖✨

**Hãy thử ngay bằng cách hỏi AI một câu hỏi có công thức!** 🚀
