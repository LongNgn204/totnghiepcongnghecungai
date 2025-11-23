import { defineConfig } from 'drizzle-kit';

// Sử dụng environment variables để kết nối với Cloudflare D1 production
// Tạo file .env và thêm:
// CLOUDFLARE_ACCOUNT_ID=your_account_id
// CLOUDFLARE_DATABASE_ID=5e6f80b8-02cd-4d7a-8f5e-a17fd24dd60d
// CLOUDFLARE_API_TOKEN=your_api_token

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './migrations',
    dialect: 'sqlite',
    driver: 'd1-http',
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID || '5e6f80b8-02cd-4d7a-8f5e-a17fd24dd60d',
        token: process.env.CLOUDFLARE_API_TOKEN!,
    },
});
