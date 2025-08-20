const env = typeof import.meta !== 'undefined' ? import.meta.env : process.env;

export default {
  env: {
    NODE_ENV: env.MODE || env.NODE_ENV,
    VITE_API_URL: (env.MODE || env.NODE_ENV) === 'production' 
      ? env.VITE_API_URL_PROD 
      : env.VITE_API_URL_DEV || 'http://localhost:3000',
  },
  isProduction: (env.MODE || env.NODE_ENV) === 'production',
  server: (env.MODE || env.NODE_ENV) === 'production'
    ? env.VITE_API_URL_PROD 
    : env.VITE_API_URL_DEV || 'http://localhost:3000'
};