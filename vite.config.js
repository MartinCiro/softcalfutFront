import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
      '@componentsUseable': path.resolve(__dirname, 'src/UI/useable-components'),
    },
  }
})
