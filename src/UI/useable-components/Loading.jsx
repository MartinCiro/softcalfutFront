import React from 'react';
import { Container, Spinner } from 'react-bootstrap';


const LoadingSpinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center py-5 text-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <Spinner animation="border" role="status" />
            <div>Cargando anuncios...</div>
      </div>
    </Container>
  );
};

export default LoadingSpinner;
