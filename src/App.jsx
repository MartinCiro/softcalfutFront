import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@src/App.css';

// Componentes de autenticación
import Login from '@screens/Login';
import Historia from '@screens/Historia';
import MisionVision from '@screens/MisionVision';
import Futbol from '@screens/Futbol';
import FutbolSala from '@screens/FutbolSala';
import ClubRedirect from '@componentsUseable/ClubRedirect';

import ProtectedRoute from '@routes/common/ProtectedRoute';

// Componentes de layout
import Layout from '@layouts/Layout';

// Componentes de páginas
import Dashboard from '@screens/Dashboard';

import '@fortawesome/fontawesome-free/css/all.min.css';
import ProgramacionList from '@screens/Programacion';
import PrincipalList from '@screens/Principal';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas sin layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas públicas con layout */}
        <Route element={<Layout />}>
          <Route path="/lcf/historia" element={<Historia />} />
          <Route path="/lcf/mision-vision" element={<MisionVision />} />
          <Route path="/torneos/futbol" element={<Futbol />} />
          <Route path="/torneos/futbol-sala" element={<FutbolSala />} />
          <Route path="/torneos/programacion" element={<ProgramacionList />} />
          <Route path="/" element={<PrincipalList />} />
          <Route path="/club" element={<ClubRedirect />} />
          
          {/* Rutas protegidas - requieren autenticación */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Más rutas protegidas aquí */}
          </Route>
        </Route>

        {/* Redirección por defecto - ajusta según necesites */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;