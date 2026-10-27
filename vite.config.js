import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages 프로젝트 사이트는 /<repo명>/ 하위 경로에서 서비스됩니다.
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [react()],
})
