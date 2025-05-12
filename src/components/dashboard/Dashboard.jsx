import React from 'react';
import { Container } from 'react-bootstrap';
import AnunciosList from '@components/Anuncios/Anuncio';
import { MDBIcon } from 'mdb-react-ui-kit';
import './Dashboard.css';

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
      <AnunciosList />
    </div>
  );
};

export default Dashboard;
