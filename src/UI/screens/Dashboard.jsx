import React from 'react';
import AnunciosList from '@screens/Anuncio';
import RolesList from '@screens/Roles';
import EstadoList from '@screens/Estado';
import CategoriaList from '@screens/Categoria';
import PermisosList from '@screens/Permiso';
import TorneosList from '@screens/Torneo';
import EquiposList from '@screens/Equipo';
import UsuariosList from '@screens/Usuario';
import { MDBIcon } from 'mdb-react-ui-kit';
import '@styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h2 className="section-title">
          <MDBIcon fas icon="tachometer-alt" className="me-2" />
          Dashboard
        </h2>
      </div>

      {/* Componente de anuncios maneja su propio estado */}
      <UsuariosList />
    </div>
  );
};

export default Dashboard;
