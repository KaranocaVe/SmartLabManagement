import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    // 配置代理，解决开发环境下的跨域问题
    proxy: {
      // 当有 /api 前缀的请求时，会自动代理到 target 地址
      '/api': {
        // 这是您后端服务的基础地址
        target: 'http://localhost:8080',
        // 代理时会更改请求头的 host，使其与目标服务器匹配
        changeOrigin: true,
        // 注意：如果您的后端API路径本身不包含 /api (例如 /v1/users),
        // 您可能需要重写路径，像这样:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
