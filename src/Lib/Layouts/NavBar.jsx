import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';
import '@styles/NavBar.css';

const NavBar = () => {
  return (
    <Navbar expand="lg" className="navbar-custom" data-bs-theme="dark" collapseOnSelect>
      <Container>
        {/* Botón hamburguesa para pantallas pequeñas */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenedor colapsable */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto d-flex gap-4 align-items-center">
            <NavLink to="/" className="nav-link">
              <MDBIcon fas icon="home" className="me-1" />
              Inicio
            </NavLink>
            <NavLink to="/lcf" className="nav-link">
              <MDBIcon fas icon="building" className="me-1" />
              LCF
            </NavLink>
            <NavLink to="/torneos" className="nav-link">
              <MDBIcon fas icon="trophy" className="me-1" />
              Torneos
            </NavLink>
            <NavLink to="/escuela" className="nav-link">
              <MDBIcon fas icon="book" className="me-1" />
              Selecciones LCF
            </NavLink>
            <NavLink to="/club" className="nav-link">
              <MDBIcon fas icon="futbol" className="me-1" />
              Mi Club
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
