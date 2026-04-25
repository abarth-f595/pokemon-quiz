import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel: VITE_BASE_URL 未設定 → '/' (ルート)
  // GitHub Pages: VITE_BASE_URL=/pokemon-quiz/ を指定してビルド
  base: process.env.VITE_BASE_URL || '/',
})

