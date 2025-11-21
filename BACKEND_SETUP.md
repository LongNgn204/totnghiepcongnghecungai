# 🚀 Hướng Dẫn Setup Backend Authentication

## 1. Cấu hình Frontend

### Tạo file `.env.local` từ template:
```bash
cp .env.local.example .env.local
```

### Sửa `VITE_API_URL` trong `.env.local`:
```env
# Development (local Cloudflare Workers)
VITE_API_URL=http://localhost:8787

# Production (sau khi deploy)
VITE_API_URL=https://your-worker-name.your-account.workers.dev
```

## 2. Chạy Backend (Cloudflare Workers)

### Cài đặt dependencies:
```bash
cd workers
npm install
```

### Chạy dev server:
```bash
npm run dev
# hoặc
wrangler dev
```

Backend sẽ chạy tại `http://localhost:8787`

## 3. API Endpoints Đã Có Sẵn

Backend đã có đầy đủ authentication endpoints:

### **Auth APIs:**
- `POST /api/auth/register` - Đăng ký tài khoản mới
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }
  ```

- `POST /api/auth/login` - Đăng nhập
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Lấy thông tin user (cần token)
  ```
  Headers: Authorization: Bearer <token>
  ```

- `POST /api/auth/logout` - Đăng xuất
  ```
  Headers: Authorization: Bearer <token>
  ```

- `PUT /api/auth/profile` - Cập nhật profile
  ```json
  {
    "displayName": "New Name",
    "bio": "My bio"
  }
  ```

### **Data APIs:** (Tất cả cần authentication)
- `/api/exams` - Quản lý đề thi
- `/api/flashcards` - Quản lý flashcards  
- `/api/chat` - Lịch sử chat
- `/api/progress` - Theo dõi tiến độ
- `/api/leaderboard` - Bảng xếp hạng

## 4. Cách Hoạt Động

### Frontend:
1. User đăng ký/đăng nhập qua `LoginModal`
2. Backend trả về `JWT token`
3. Token được lưu vào `localStorage` key: `auth_token`
4. Tất cả API calls tự động gửi kèm token trong header `Authorization: Bearer <token>`

### Auto-login:
- Khi refresh trang, AuthContext tự động check token
- Nếu token hợp lệ → auto login
- Nếu token hết hạn → logout và xóa token

## 5. Testing

### Test Register:
1. Click "Đăng Nhập" ở Header
2. Chọn tab "Đăng Ký"  
3. Nhập email, password, tên
4. Click "Đăng Ký"

### Test Login:
1. Click "Đăng Nhập"
2. Nhập email/password đã đăng ký
3. Click "Đăng Nhập"

### Test Protected Routes:
- Sau khi login, thử tạo đề thi, flashcards
- Data sẽ được sync với backend
- Logout và login lại → data vẫn còn

## 6. Deploy Backend (Production)

```bash
cd workers
wrangler login
wrangler deploy
```

Sau khi deploy, update `VITE_API_URL` trong `.env.local` thành URL của worker.

## 7. Troubleshooting

### CORS Error:
Backend đã config CORS headers sẵn, nếu vẫn lỗi check:
- `workers/src/index.ts` có `Access-Control-Allow-Origin: *`

### Token Invalid:
- Clear localStorage và login lại
- Check backend có chạy không

### Connection Refused:
- Backend chưa chạy → `cd workers && npm run dev`
- Port bị chiếm → đổi port trong wrangler.toml

---

✅ **Hoàn tất!** Bây giờ bạn có hệ thống auth hoàn chỉnh với:
- Đăng ký/Đăng nhập thật
- JWT token authentication  
- Auto-login
- Sync data với backend
- Protected routes
