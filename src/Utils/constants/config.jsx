export default {
  server: import.meta.env.VITE_API_URL || "http://localhost:3000",
  env: import.meta.env.VITE_ENV || 'dev'
};