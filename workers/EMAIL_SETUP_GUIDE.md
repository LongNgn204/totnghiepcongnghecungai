# 📧 Hướng Dẫn Setup Email Service

## 🎯 Tổng Quan

Hệ thống sử dụng **Resend API** để gửi email reset mật khẩu. Resend miễn phí cho:
- ✅ **100 emails/ngày**
- ✅ **3,000 emails/tháng**
- ✅ Không cần credit card để đăng ký

---

## 📝 Bước 1: Đăng Ký Resend

1. Truy cập: **https://resend.com**
2. Click **"Sign Up"** và đăng ký tài khoản (có thể dùng GitHub)
3. Xác nhận email

---

## 🔑 Bước 2: Lấy API Key

1. Sau khi login, vào **API Keys**: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Nhập tên: `ai-hoc-tap-local` hoặc `ai-hoc-tap-production`
4. Chọn quyền: **"Sending access"** (Full access)
5. Click **"Add"**
6. **Copy API Key** (bắt đầu với `re_...`)
   - ⚠️ **LƯU Ý:** Chỉ hiển thị 1 lần duy nhất, lưu lại ngay!

---

## 📧 Bước 3: Setup Email Domain (Tùy chọn)

### **Option A: Dùng Test Domain (Nhanh - Cho Dev)**

Resend cung cấp domain test miễn phí:
```
onboarding@resend.dev
```

**Ưu điểm:**
- ✅ Không cần verify domain
- ✅ Dùng ngay lập tức

**Nhược điểm:**
- ⚠️ Email có thể bị vào spam
- ⚠️ Chỉ nên dùng để test

### **Option B: Verify Custom Domain (Khuyến nghị cho Production)**

Nếu bạn có domain riêng (ví dụ: `example.com`):

1. Vào **Domains**: https://resend.com/domains
2. Click **"Add Domain"**
3. Nhập domain của bạn (ví dụ: `example.com`)
4. Resend sẽ đưa ra các **DNS records** cần thêm:
   - **SPF record**
   - **DKIM record**
   - **DMARC record**

5. Vào quản lý DNS của domain (Cloudflare, Namecheap, GoDaddy...)
6. Thêm các records theo hướng dẫn
7. Đợi 5-15 phút để DNS propagate
8. Quay lại Resend click **"Verify"**

**Sau khi verify:**
```
noreply@example.com
support@example.com
```

---

## ⚙️ Bước 4: Cấu Hình Development Environment

### **Local Development (.dev.vars)**

File: `workers/.dev.vars` (đã tạo sẵn)

```bash
# Resend API Key
RESEND_API_KEY=re_YOUR_API_KEY_HERE

# Email sender (Option A: Test domain)
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=AI Học Tập

# Or Option B: Your custom domain
# EMAIL_FROM=noreply@yourdomain.com
# EMAIL_FROM_NAME=AI Học Tập - Long Nguyễn
```

**Cách chạy:**
```bash
cd workers
wrangler dev
```

---

## 🚀 Bước 5: Cấu Hình Production (Cloudflare)

### **Setup trên Cloudflare Dashboard:**

1. Vào **Cloudflare Dashboard**: https://dash.cloudflare.com
2. Chọn **Workers & Pages**
3. Chọn worker của bạn (`ai-hoc-tap-api`)
4. Vào tab **Settings** → **Variables**
5. Thêm các **Environment Variables**:

```
RESEND_API_KEY = re_YOUR_API_KEY_HERE
EMAIL_FROM = noreply@yourdomain.com
EMAIL_FROM_NAME = AI Học Tập
```

6. Click **"Save"**

### **Hoặc dùng Wrangler CLI:**

```bash
cd workers

# Set RESEND_API_KEY
wrangler secret put RESEND_API_KEY
# Nhập: re_YOUR_API_KEY_HERE

# Set EMAIL_FROM
wrangler secret put EMAIL_FROM
# Nhập: noreply@yourdomain.com

# Set EMAIL_FROM_NAME
wrangler secret put EMAIL_FROM_NAME
# Nhập: AI Học Tập
```

**Deploy:**
```bash
wrangler deploy
```

---

## 🧪 Bước 6: Test Email

### **Test bằng API Tester (Frontend)**

1. Mở frontend: `http://localhost:5173/api-tester`
2. Click nút **"Forgot Password"** quick test
3. Hoặc manual test:
   - Method: **POST**
   - Endpoint: `/api/auth/forgot-password`
   - Body:
     ```json
     {
       "email": "your-test-email@gmail.com"
     }
     ```

4. Check Gmail → Inbox hoặc **Spam folder**

### **Expected Response:**

**Development (không có API key):**
```json
{
  "success": true,
  "data": {
    "message": "Mã reset đã được tạo (Dev mode - email không được gửi)",
    "resetCode": "123456"
  }
}
```

**Production (có API key):**
```json
{
  "success": true,
  "data": {
    "message": "Mã reset đã được gửi đến email của bạn"
  }
}
```

---

## 📊 Monitoring & Logs

### **Resend Dashboard:**
- Xem emails đã gửi: https://resend.com/emails
- Check delivery status, open rate, bounce rate

### **Cloudflare Logs:**
```bash
wrangler tail
```

Xem real-time logs của worker, bao gồm email sending status.

---

## ❌ Troubleshooting

### **Problem: "Email not sent" error**

**Giải pháp:**
1. Check API key đúng chưa
2. Verify domain nếu dùng custom domain
3. Check Resend Dashboard có logs lỗi không

### **Problem: Email vào Spam**

**Giải pháp:**
1. Verify custom domain với SPF/DKIM/DMARC
2. Thêm domain vào whitelist trong Gmail settings
3. Ask người nhận mark "Not Spam"

### **Problem: "Domain not verified"**

**Giải pháp:**
1. Dùng `onboarding@resend.dev` để test
2. Hoặc verify domain đúng cách

---

## 🎨 Customize Email Template

File: `workers/src/email-service.ts`

Function: `generateResetEmailHTML()`

Bạn có thể sửa:
- Colors (đổi từ purple `#667eea` sang màu khác)
- Font sizes
- Thêm logo
- Thêm social links

---

## 💰 Pricing (Nếu vượt Free Tier)

| Plan | Price | Emails/month | Features |
|------|-------|--------------|----------|
| **Free** | $0 | 3,000 | Basic features |
| **Pro** | $20/month | 50,000 | Analytics, webhooks |
| **Scale** | Custom | Unlimited | Dedicated IP, priority support |

**Lưu ý:** 3,000 emails/tháng là đủ cho app startup.

---

## 🔐 Security Best Practices

1. ✅ **Không commit** `.dev.vars` hoặc API keys lên Git
2. ✅ Dùng **Cloudflare Secrets** cho production
3. ✅ Rotate API keys định kỳ (3-6 tháng)
4. ✅ Limit rate (chống spam): 5 requests/IP/15 phút
5. ✅ Log mọi email sending attempts

---

## 📞 Support

- **Resend Docs:** https://resend.com/docs
- **Resend Discord:** https://discord.gg/resend
- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/

---

## ✅ Checklist

- [ ] Đăng ký Resend account
- [ ] Lấy API key
- [ ] Setup `.dev.vars` với API key
- [ ] Test locally với `wrangler dev`
- [ ] Verify custom domain (nếu có)
- [ ] Setup production environment variables
- [ ] Deploy: `wrangler deploy`
- [ ] Test production với real email
- [ ] Monitor logs và delivery rates

---

**🎉 Done! Email service sẵn sàng!**
