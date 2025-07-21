import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    historyApiFallback: true // Para rutas no-root
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
    sourcemap: false
  },
  server: {
    host: true
  }
})
