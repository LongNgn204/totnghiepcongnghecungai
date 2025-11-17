@echo off
echo ============================================
echo   AI HỖ TRỢ HỌC TẬP CÔNG NGHỆ
echo ============================================
echo.

REM Kiểm tra Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Node.js chưa được cài đặt!
    echo Vui lòng tải và cài đặt tại: https://nodejs.org
    pause
    exit /b 1
)

echo [✓] Đã tìm thấy Node.js
node --version
echo.

REM Kiểm tra .env.local
if not exist ".env.local" (
    echo [LỖI] Chưa có file .env.local!
    echo Vui lòng tạo file .env.local và thêm API key
    pause
    exit /b 1
)

echo [✓] Đã tìm thấy file .env.local
echo.

REM Kiểm tra node_modules
if not exist "node_modules" (
    echo [!] Đang cài đặt dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [LỖI] Cài đặt thất bại!
        pause
        exit /b 1
    )
    echo [✓] Cài đặt hoàn tất
    echo.
)

echo ============================================
echo   KHỞI ĐỘNG ỨNG DỤNG
echo ============================================
echo.
echo Truy cập: http://localhost:3000
echo Nhấn Ctrl+C để dừng
echo.

call npm run dev
