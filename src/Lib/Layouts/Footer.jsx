import React from 'react';
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '@styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-custom text-white py-4">
      <Container className="d-flex justify-content-between flex-column flex-md-row text-center text-md-start">
        <div className="mb-3 mb-md-0">
          <NavLink to="/terminos" className="footer-link me-3 d-block d-md-inline">Términos y condiciones</NavLink>
          <NavLink to="/contacto" className="footer-link d-block d-md-inline">Contáctenos</NavLink>
          <div>© 2025 LIGA CALDENSE DE FUTBOL</div>
        </div>
        <div className="text-md-end small">
          <div>Todos los derechos reservados</div>
          <div>Calle 49B #74-31</div>
          <div>Medellín, Antioquia - Colombia</div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
