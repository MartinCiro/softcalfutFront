import React from 'react';
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-custom text-white py-4">
      <Container className="d-flex justify-content-between flex-column flex-md-row">
        <div className="mb-3 mb-md-0">
          <NavLink to="/terminos" className="footer-link me-3">Términos y condiciones</NavLink>
          <NavLink to="/contacto" className="footer-link">Contáctenos</NavLink>
        </div>
        <div className="text-end">
          <div>© 2025 LIGA CALDENSE DE FUTBOL</div>
          <div>Todos los derechos reservados</div>
          <div>secretaria@laf.com.co</div>
          <div>Calle.49B #74-31</div>
          <div>Medellín, Antioquia - Colombia</div>
          <div>Design/Hosting: FénixPuntoNet - fenixpuntonet.com</div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
