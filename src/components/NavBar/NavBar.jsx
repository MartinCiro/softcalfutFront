import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';
import { NavLink  } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <Navbar expand="lg" className="navbar-custom" data-bs-theme="dark">
      <Container className="justify-content-center">
        <Nav className="d-flex gap-4 align-items-center ">
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
            Escuela LCF
          </NavLink>
          <NavLink to="/club" className="nav-link">
            <MDBIcon fas icon="futbol" className="me-1" />
            Mi Club
          </NavLink>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
