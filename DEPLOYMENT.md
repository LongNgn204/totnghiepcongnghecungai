# 🚀 Hướng Dẫn Triển Khai (Deployment Guide)

## 📋 Mục Lục
1. [Triển khai lên GitHub Pages](#github-pages)
2. [Triển khai lên Vercel](#vercel)
3. [Triển khai lên Netlify](#netlify)
4. [Chạy trên localhost](#localhost)

---

## 🌐 1. GitHub Pages

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Bước 2: Cài đặt gh-pages
```bash
npm install --save-dev gh-pages
```

### Bước 3: Cập nhật package.json
Thêm vào `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Bước 4: Deploy
```bash
npm run deploy
```

### Bước 5: Cấu hình GitHub Settings
1. Vào repository → Settings → Pages
2. Source: chọn `gh-pages` branch
3. Save

✅ Website sẽ có tại: `https://YOUR_USERNAME.github.io/YOUR_REPO`

---

## ⚡ 2. Vercel (Khuyên dùng - Dễ nhất)

### Cách 1: Deploy qua Vercel Dashboard
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click "New Project"
4. Import repository
5. Cấu hình:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Thêm Environment Variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `your_api_key`
7. Click "Deploy"

### Cách 2: Deploy qua CLI
```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

✅ Website tự động deploy khi push code mới lên GitHub!

---

## 🎨 3. Netlify

### Cách 1: Deploy qua Netlify Dashboard
1. Truy cập: https://app.netlify.com
2. Đăng nhập
3. Click "Add new site" → "Import an existing project"
4. Chọn repository từ GitHub
5. Cấu hình build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Environment variables:
   - `VITE_GEMINI_API_KEY` = your_api_key
7. Click "Deploy site"

### Cách 2: Deploy qua CLI
```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy production
netlify deploy --prod
```

### Cách 3: Drag & Drop
1. Build locally: `npm run build`
2. Vào https://app.netlify.com/drop
3. Kéo thả folder `dist` vào

✅ Xong! Website đã online

---

## 💻 4. Localhost (Development)

### Yêu cầu
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repo-url>
cd ai-hỗ-trợ-học-tập-công-nghệ-(lớp-6-12)

# Cài dependencies
npm install

# Tạo file .env.local
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local

# Chạy dev server
npm run dev
```

✅ Truy cập: `http://localhost:3000`

### Build Production
```bash
npm run build
```

Folder `dist` chứa file production-ready.

---

## 🔑 Lấy Gemini API Key

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập Google
3. Click "Create API Key"
4. Copy key và paste vào `.env.local`

**Lưu ý:** API key là **MIỄN PHÍ** với giới hạn hợp lý.

---

## 🐛 Troubleshooting

### Lỗi: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port already in use"
```bash
# Đổi port trong vite.config.ts
export default defineConfig({
  server: {
    port: 3001
  }
})
```

### Lỗi: "API key not working"
- Kiểm tra file `.env.local` có đúng format: `VITE_GEMINI_API_KEY=xxx`
- Restart dev server sau khi thêm API key
- Kiểm tra API key có hợp lệ tại Google AI Studio

### Lỗi: "Build failed"
```bash
# Clear cache
npm run build -- --force
```

---

## 📊 So Sánh Các Nền Tảng

| Tính năng | GitHub Pages | Vercel | Netlify |
|-----------|--------------|--------|---------|
| **Miễn phí** | ✅ | ✅ | ✅ |
| **Auto deploy** | ⚠️ Cần setup | ✅ | ✅ |
| **Custom domain** | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ |
| **Environment vars** | ❌ | ✅ | ✅ |
| **Dễ setup** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tốc độ** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**🏆 Khuyến nghị:** Vercel (dễ nhất, nhanh nhất, tốt nhất cho Vite)

---

## 🎯 Checklist Trước Khi Deploy

- [ ] Test tất cả tính năng trên localhost
- [ ] Đã có Gemini API key hợp lệ
- [ ] File `.env.local` được thêm vào `.gitignore`
- [ ] Build thành công: `npm run build`
- [ ] Không có lỗi TypeScript
- [ ] Đã thêm environment variable trên hosting
- [ ] Test responsive trên mobile
- [ ] Check console không có error

---

## 📞 Hỗ Trợ

Gặp vấn đề? Liên hệ:
- 📧 Email: longhngn.hnue@gmail.com
- 📱 Zalo: 0896636181

---

**Chúc bạn deploy thành công! 🎉**
