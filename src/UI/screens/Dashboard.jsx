import React from 'react';
import AnunciosList from '@screens/Anuncio';
import RolesList from '@screens/Roles';
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
      <RolesList />
    </div>
  );
};

export default Dashboard;
