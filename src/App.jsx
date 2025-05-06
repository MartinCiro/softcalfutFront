import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@src/App.css';

// Componentes de autenticación
import Login from '@components/auth/Login';
import ProtectedRoute from '@components/auth/ProtectedRoute';

// Componentes de layout
import Layout from '@components/layout/Layout';

// Componentes de páginas
import Dashboard from '@components/dashboard/Dashboard';
import Facturas from '@components/facturas/Facturas';
import Clientes from '@components/clientes/Clientes';

// Componentes de administración
import Usuarios from '@components/administracion/usuarios/Usuarios';
import Configuracion from '@components/administracion/configuracion/Configuracion';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/login" element={ < Login />} />
        
        {/* Ruta por defecto redirige a dashboard si está autenticado, o a login si no */}
        <Route path="/" element={ <Navigate to="/dashboard" replace />} />
        
        {/* Rutas protegidas que requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={< Dashboard />} />
            <Route path="/facturas"  element={< Facturas />} />
            <Route path="/clientes"  element={< Clientes />} />
            
            {/* Rutas de administración */}
            <Route path="/usuarios" element={< Usuarios />} />
            <Route path="/configuracion" element={< Configuracion />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}
export default App
