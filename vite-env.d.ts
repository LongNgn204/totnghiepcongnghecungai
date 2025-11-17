/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // Thêm các env variables khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
