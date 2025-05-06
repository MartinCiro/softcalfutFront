import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <Navbar expand="lg" className="bg-primary" data-bs-theme="dark">
      <Container className="justify-content-center">
        <Nav className="d-flex gap-4 align-items-center ">
          <Link to="/" className="nav-link text-black">
            <MDBIcon fas icon="home" className="me-1" color="green" />
            Inicio
          </Link>
          <Link to="/lcf" className="nav-link text-black">
            <MDBIcon fas icon="building" className="me-1" />
            LCF
          </Link>
          <Link to="/torneos" className="nav-link text-black">
            <MDBIcon fas icon="trophy" className="me-1" />
            Torneos
          </Link>
          <Link to="/escuela" className="nav-link text-black">
            <MDBIcon fas icon="book" className="me-1" />
            Escuela LCF
          </Link>
          <Link to="/club" className="nav-link text-black">
            <MDBIcon fas icon="futbol" className="me-1" />
            Mi Club
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
