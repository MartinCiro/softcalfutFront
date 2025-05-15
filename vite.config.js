import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src'       : path.resolve(__dirname, 'src'),  
      '@store'     : path.resolve(__dirname, 'src/store'), 
      '@hooks'     : path.resolve(__dirname, 'src/Lib/Hooks'),
      '@utils'     : path.resolve(__dirname, 'src/Utils'),
      '@pages'     : path.resolve(__dirname, 'src/pages'),
      '@routes'    : path.resolve(__dirname, 'src/routes'),
      '@assets'    : path.resolve(__dirname, 'src/assets'),
      '@styles'    : path.resolve(__dirname, 'src/UI/screens/styles'),
      '@screens'   : path.resolve(__dirname, 'src/UI/screens'),
      '@layouts'   : path.resolve(__dirname, 'src/Lib/Layouts'),
      '@context'   : path.resolve(__dirname, 'src/context'),
      '@services'  : path.resolve(__dirname, 'src/Lib/Services'),
      '@constants' : path.resolve(__dirname, 'src/constants'),
      '@componentsUseable': path.resolve(__dirname, 'src/UI/useable-components'),
    },
  },
  server: {
    proxy: {
      '/api/siesa': {
        target: 'https://serviciosconnekta.siesacloud.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/siesa/, '/api/v3'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Error de proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Enviando solicitud a:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Recibida respuesta de:', req.url, 'con estado:', proxyRes.statusCode);
          });
        }
      }
    }
  }
})
