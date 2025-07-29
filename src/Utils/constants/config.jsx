const env = import.meta.env || process.env;

// 3. Configuración condicional
export default {
  env: {
    NODE_ENV: env.env,
    VITE_API_URL: env.MODE === 'production' 
      ? env.VITE_API_URL_PROD 
      : env.VITE_API_URL_DEV || 'http://localhost:3000',
  },
  isProduction: env.MODE === 'production',
  server: env.MODE.env === 'production' 
    ? env.VITE_API_URL_PROD 
    : env.VITE_API_URL_DEV || 'http://localhost:3000'
};