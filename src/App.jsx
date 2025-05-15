import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@src/App.css';

// Componentes de autenticación
import Login from '@screens/Login';
import ProtectedRoute from '@routes/common/ProtectedRoute';

// Componentes de layout
import Layout from '@layouts/Layout';

// Componentes de páginas
import Dashboard from '@screens/Dashboard';

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Más rutas protegidas aquí */}
          </Route>
        </Route>
        
        {/* Redirigir cualquier ruta desconocida a login o dashboard según auth */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;