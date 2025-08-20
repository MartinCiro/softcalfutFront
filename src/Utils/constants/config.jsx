const env = typeof import.meta !== 'undefined' ? import.meta.env : process.env;

export default {
  env: {
    NODE_ENV: env.NODE_ENV,
    VITE_API_URL: env.NODE_ENV === 'production' 
      ? env.VITE_API_URL_PROD 
      : env.VITE_API_URL_DEV || 'http://localhost:3000',
  },
  isProduction: env.NODE_ENV === 'production',
  server: env.NODE_ENV === 'production'
    ? env.VITE_API_URL_PROD 
    : env.VITE_API_URL_DEV || 'http://localhost:3000'
};