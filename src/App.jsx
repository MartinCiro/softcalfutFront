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
import NavBar from '@components/NavBar/NavBar';
import Footer from '@components/Footer/Footer';

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/login" element={ < Login />} />
        
        {/* Ruta por defecto redirige a dashboard si está autenticado, o a login si no */}
        <Route path="/" element={ <Navigate to="/dashboard" replace />} />
        
        {/* Rutas protegidas que requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={< Dashboard />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </Router>
  )
}
export default App
