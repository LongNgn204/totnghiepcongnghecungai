/** @type {import('tailwindcss').Config} */
export default {
  // KHÔNG CÓ DARK MODE - Light theme only
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CAM NĂNG LƯỢNG (Deep Orange & Clean White)
        primary: {
          DEFAULT: '#f97316', // Orange 500 (Main Action)
          hover: '#ea580c',   // Orange 600 (Hover)
          active: '#c2410c',  // Orange 700 (Active)
          light: '#fff7ed',   // Orange 50 (Nền nhẹ)
          subtle: '#ffedd5',  // Orange 100 (Border/Background phụ)
        },
        // MÀU NỀN SẠCH (Clean White Theme)
        background: '#f8fafc', // Slate 50 (Nền tổng thể sáng hơn)
        surface: '#ffffff',    // Trắng tinh
        'surface-hover': '#fff7ed', // Orange 50 (Hover hiệu ứng nhẹ)

        // MÀU CHỮ (Tăng tương phản)
        text: {
          heading: '#0f172a', // Slate 900 (Đen hơn cho tương phản cao trên nền trắng)
          main: '#334155',    // Slate 700
          sub: '#64748b',     // Slate 500
          'orange-dark': '#c2410c', // Cam đậm
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'float': '0 10px 15px -3px rgba(249, 115, 22, 0.3)', // Bóng cam cho nút nổi
        'orange-glow': '0 0 15px rgba(249, 115, 22, 0.2)',
      }
    },
  },
  plugins: [],
}
