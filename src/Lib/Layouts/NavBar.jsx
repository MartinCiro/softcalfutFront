import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';
import '@styles/NavBar.css';

const NavBar = () => {
  return (
    <Navbar expand="lg" className="navbar-custom" data-bs-theme="dark" collapseOnSelect>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto d-flex gap-4 align-items-center">

            <NavLink to="/" className="nav-link">
              <MDBIcon fas icon="home" className="me-1" />
              Inicio
            </NavLink>

            <NavDropdown title={<span><MDBIcon fas icon="building" className="me-1" /> LCF</span>} id="dropdown-lcf">
              <NavDropdown.Item as={NavLink} to="/lcf/historia">Historia</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/lcf/mision-vision">Misión y Visión</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/lcf/sobre">Sobre la Liga</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/lcf/organigrama">Organigrama</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<span><MDBIcon fas icon="trophy" className="me-1" /> Torneos</span>} id="dropdown-torneos">
              <NavDropdown.Item as={NavLink} to="/torneos/futbol">Fútbol</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Fútbol Sala</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<span><MDBIcon fas icon="book" className="me-1" /> Escuela LCF</span>} id="dropdown-escuela">
              <NavDropdown.Item as={NavLink} to="/escuela/formacion">Escuela de Formación</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/escuela/matriculas">Matrículas</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/escuela/acerca">Acerca de la Escuela</NavDropdown.Item>
            </NavDropdown>

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
