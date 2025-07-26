// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4173;

// Sirve los archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Maneja todas las rutas para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});