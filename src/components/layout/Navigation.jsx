import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '@services/AuthService';
import logoPositiva from '@assets/logos/Positiva.png';

const Navigation = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          <img 
            src={logoPositiva} 
            alt="Logo" 
            height="30" 
            className="d-inline-block align-top" 
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/facturas">Facturas</Nav.Link>
            <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
            <NavDropdown title="Administración" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/usuarios">Usuarios</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/configuracion">Configuración</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            {currentUser && (
              <NavDropdown title={currentUser.correo} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;