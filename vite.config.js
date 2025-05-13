import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() ],
  base: '/personal-growth-site/', // 请务必将 YOUR_REPOSITORY_NAME 替换为您的 GitHub 仓库名
})
