import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env file based on the mode
  const env = loadEnv(mode, process.cwd(), '');

  const isProduction = env === 'production';

  console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

  return {
    plugins: [react()],
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      cors: true,
      historyApiFallback: true,
      allowedHosts: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      },
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@hooks': path.resolve(__dirname, 'src/Lib/Hooks'),
        '@utils': path.resolve(__dirname, 'src/Utils'),
        '@routes': path.resolve(__dirname, 'src/routes'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@styles': path.resolve(__dirname, 'src/UI/screens/styles'),
        '@screens': path.resolve(__dirname, 'src/UI/screens'),
        '@layouts': path.resolve(__dirname, 'src/Lib/Layouts'),
        '@services': path.resolve(__dirname, 'src/Lib/Services'),
        '@constants': path.resolve(__dirname, 'src/Utils/constants'),
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
      port: 4173,
      cors: true,
      strictPort: false,
      allowedHosts: true,
      watch: {
        usePolling: true
      },
      hmr: isProduction
        ? {
            protocol: 'wss',
            host: 'www.softcalfut.duckdns.org',
            port: 443,
            clientPort: 443,
          }
        : {
            protocol: 'ws',
            host: 'localhost',
            clientPort: 4173,
          },
      proxy: {
        '/api': {
          target: isProduction
            ? env.VITE_API_URL_PROD
            : env.VITE_API_URL_DEV || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});