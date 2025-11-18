# 🚀 AI Học Tập - Backend API

Backend API cho ứng dụng AI Học Tập, sử dụng **Cloudflare Workers** và **D1 Database**.

## 📦 Tech Stack

- **Runtime:** Cloudflare Workers (Edge computing)
- **Database:** Cloudflare D1 (SQLite on edge)
- **Router:** itty-router
- **Authentication:** JWT + bcrypt
- **Email:** Resend API

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd workers
npm install
```

### 2. Configure Environment Variables

Copy `.dev.vars` example and fill in your credentials:

```bash
# .dev.vars
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=AI Học Tập
GEMINI_API_KEY=your_gemini_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

**See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) for detailed email setup instructions.**

### 3. Initialize Database (First time only)

```bash
# Create D1 database
npm run db:create

# Initialize schema (production)
npm run db:init

# Or initialize locally
npm run db:init-local
```

### 4. Run Development Server

```bash
npm run dev
```

API will be available at: `http://localhost:8787`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/user/:id` | Get user by ID |
| PUT | `/api/auth/user/:id` | Update user profile |
| POST | `/api/auth/change-password` | Change password |

### Password Reset

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/forgot-password` | Request reset code (sent to email) |
| POST | `/api/auth/verify-reset-token` | Verify reset code |
| POST | `/api/auth/reset-password` | Reset password with code |

**Flow:**
1. User enters email → API generates 6-digit code → Email sent to user
2. User enters code → API verifies code is valid & not expired
3. User enters new password → API updates password

### Exams & Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/exams/generate` | Generate AI exam with Gemini |
| POST | `/api/exams` | Save exam result |
| GET | `/api/exams` | Get user exam history |
| GET | `/api/exams/:id` | Get exam details |
| GET | `/api/leaderboard` | Get global leaderboard |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

## 🔐 Authentication

Most endpoints require authentication via `X-User-ID` header:

```javascript
fetch('http://localhost:8787/api/exams', {
  headers: {
    'X-User-ID': 'user-uuid-here'
  }
})
```

## 📧 Email Service

Tính năng reset mật khẩu sử dụng **Resend API** để gửi mã xác thực qua email.

**Setup:**
1. Đăng ký tại: https://resend.com (FREE)
2. Lấy API key
3. Cấu hình trong `.dev.vars`
4. Xem hướng dẫn chi tiết: [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)

**Email Template:**
- Professional design với gradient
- 6-digit verification code
- 15 phút expiration warning
- Responsive for mobile

## 🚀 Deploy to Production

### Deploy to Cloudflare

```bash
# Deploy to production
npm run deploy

# Or with Wrangler
wrangler deploy
```

### Set Production Environment Variables

```bash
# Method 1: Cloudflare Dashboard
# Go to Workers & Pages → Your Worker → Settings → Variables

# Method 2: Wrangler CLI
wrangler secret put RESEND_API_KEY
wrangler secret put EMAIL_FROM
wrangler secret put EMAIL_FROM_NAME
wrangler secret put GEMINI_API_KEY
```

## 📊 Database Schema

### Tables

- `auth_users` - User accounts
- `auth_sessions` - Active login sessions
- `password_reset_tokens` - Password reset codes (15 min expiry)
- `exams` - Saved exam results
- `exam_questions` - Questions & answers

See `schema.sql` for full schema.

## 🧪 Testing

### Test with Frontend API Tester

1. Start backend: `npm run dev` (port 8787)
2. Start frontend: `npm run dev` (port 5173)
3. Go to: `http://localhost:5173/api-tester`
4. Use quick test buttons or manual requests

### Test Password Reset Flow

```bash
# 1. Request reset code
curl -X POST http://localhost:8787/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 2. Verify code
curl -X POST http://localhost:8787/api/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","token":"123456"}'

# 3. Reset password
curl -X POST http://localhost:8787/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","token":"123456","newPassword":"newpass123"}'
```

## 📁 Project Structure

```
workers/
├── src/
│   ├── index.ts              # Main router & endpoints
│   ├── auth.ts               # Old auth utilities
│   ├── auth-service.ts       # New auth service (password reset)
│   ├── email-service.ts      # Email sending via Resend
│   └── utils.ts              # Helper functions
├── schema.sql                # Database schema
├── wrangler.toml             # Cloudflare config
├── package.json
├── .dev.vars                 # Local environment variables (don't commit!)
├── EMAIL_SETUP_GUIDE.md      # Email setup instructions
└── README.md                 # This file
```

## 🔧 Development Scripts

```bash
npm run dev           # Start local dev server
npm run deploy        # Deploy to Cloudflare
npm run db:create     # Create D1 database
npm run db:init       # Initialize schema (production)
npm run db:init-local # Initialize schema (local)
npm run tail          # View real-time logs
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB` | ✅ Yes | D1 Database binding (auto by Cloudflare) |
| `RESEND_API_KEY` | ⚠️ Optional | Resend API key for emails (get from resend.com) |
| `EMAIL_FROM` | ⚠️ Optional | Sender email (e.g., noreply@yourdomain.com) |
| `EMAIL_FROM_NAME` | ⚠️ Optional | Sender name (e.g., "AI Học Tập") |
| `GEMINI_API_KEY` | ⚠️ Optional | Google Gemini API key for AI |
| `ALLOWED_ORIGINS` | ⚠️ Optional | CORS origins (comma-separated) |

**Note:** Nếu không có `RESEND_API_KEY`, password reset sẽ chạy ở **dev mode** (code hiển thị trong response thay vì gửi email).

## 🐛 Troubleshooting

### Database not found

```bash
# Make sure D1 database is created
npm run db:create

# Initialize schema
npm run db:init-local
```

### Email not sending

1. Check `RESEND_API_KEY` is correct
2. Verify email domain (or use `onboarding@resend.dev`)
3. Check Resend dashboard for logs
4. See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)

### CORS errors

Add your frontend origin to `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## 📞 Support

- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Cloudflare D1:** https://developers.cloudflare.com/d1/
- **Resend API:** https://resend.com/docs

---

**Made with ❤️ by Long Nguyễn 204 | Powered by Gemini 2.0 Flash**
