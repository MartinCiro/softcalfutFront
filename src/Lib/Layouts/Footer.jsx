import React from 'react';
import { Container } from 'react-bootstrap';
import '@styles/Footer.css';
import useWhatsAppRedirect from "@hooks/useWhatsAppRedirect";

const Footer = () => {
  const buildWhatsAppUrl = useWhatsAppRedirect();
  const urlContacto = buildWhatsAppUrl("+573136547420", "Hola, me gustaria conocer más sobre la Liga Caldense de Fútbol");
  const urlTC = buildWhatsAppUrl("+573136547420", "Hola, me gustaria conocer los términos y condiciones de la Liga Caldense de Fútbol");

  return (
    <footer className="footer-custom text-white py-4">
      <Container className="d-flex justify-content-between flex-column flex-md-row text-center text-md-start">
        <div className="mb-3 mb-md-0">
          <a 
            href={urlTC} 
            onClick={(e) => {
              e.preventDefault();
              window.open(urlTC, '_blank', 'noopener,noreferrer');
            }}
            className="footer-link me-3 d-block d-md-inline"
          >
            Términos y condiciones
          </a>
          
          <a 
            href={urlContacto}
            onClick={(e) => {
              e.preventDefault();
              window.open(urlContacto, '_blank', 'noopener,noreferrer');
            }}
            className="footer-link d-block d-md-inline"
          >
            Contáctenos
          </a>
          
          <div>© 2025 LIGA CALDENSE DE FUTBOL</div>
        </div>
        <div className="text-md-end small">
          <div>Todos los derechos reservados</div>
          <div>Estadio Palogrande - Puerta 22 Norte</div>
          <div>Manizales, Caldas - Colombia</div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;