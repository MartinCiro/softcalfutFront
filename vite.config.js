import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    cors: true,
    origin: true,
    disableHostCheck: true,
    allowedHosts: ["softcalfut_front", "localhost", "softcalfut.duckdns.org"],
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
    }
  },
  resolve: {
    alias: {
      '@src'       : path.resolve(__dirname, 'src'),  
      '@hooks'     : path.resolve(__dirname, 'src/Lib/Hooks'),
      '@utils'     : path.resolve(__dirname, 'src/Utils'),
      '@routes'    : path.resolve(__dirname, 'src/routes'),
      '@assets'    : path.resolve(__dirname, 'src/assets'),
      '@styles'    : path.resolve(__dirname, 'src/UI/screens/styles'),
      '@screens'   : path.resolve(__dirname, 'src/UI/screens'),
      '@layouts'   : path.resolve(__dirname, 'src/Lib/Layouts'),
      '@services'  : path.resolve(__dirname, 'src/Lib/Services'),
      '@constants' : path.resolve(__dirname, 'src/Utils/constants'),
      '@componentsUseable': path.resolve(__dirname, 'src/UI/useable-components'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) return 'vendor';
      },
    },
  },
  chunkSizeWarningLimit: 1000,
  },
  server: {
    host: '0.0.0.0',
    cors: true,
    port: 4173,
    strictPort: false,
    hmr: {
      protocol: 'wss',
      host: 'softcalfut.duckdns.org',
      port: 443,
      clientPort: 443
    },
    proxy: {
      '/api': {
        target: 'https://api.softcalfut.duckdns.org/',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
