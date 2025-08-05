import React, { useEffect, useCallback, memo } from 'react';
import {  } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';
import { NavLink, useNavigate } from 'react-router-dom';
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import '@styles/NavBar.css';
import { useAuth } from '@hooks/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = useCallback(() => setShowLogoutModal(true), []);

  const handleConfirmLogout = useCallback(() => {
    logout(navigate);
    setShowLogoutModal(false);
  }, [logout, navigate]);
  
  const handleCloseLogoutModal = useCallback(() => setShowLogoutModal(false), []);
  if (isLoading) return null;
  const displayName = isAuthenticated ? (user?.usuario?.nombre || 'Usuario') : 'LCF';

  return (
    <>
      <Navbar expand="lg" className="navbar-custom" data-bs-theme="dark" collapseOnSelect>
        <Container className="position-relative">
          <div className="d-none d-lg-flex align-items-center me-4 user-name-lg">
            <span className="text-light">{displayName}</span>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <div className="d-lg-none d-flex align-items-center mobile-elements me-4">
            <div className="user-name-sm pe-2 pt-1">
              <span className="text-light">{displayName}</span>
            </div>
          </div>


          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto d-flex gap-3 align-items-center">
              <NavLink to="/" className="nav-link mt-sm-3 mt-lg-0">
                <MDBIcon fas icon="home" className="me-1" />
                Inicio
              </NavLink>

              <NavDropdown title={<span><MDBIcon fas icon="trophy" className="me-1" /> Torneos</span>} id="dropdown-torneos">
                <NavDropdown.Item as={NavLink} to="/torneos/futbol">Municipal</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Sport-man</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Femenino</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Futbol Sala</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Festi torneo Baby</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Copa Atardeceres</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">BBB</NavDropdown.Item>
              </NavDropdown>

              <NavLink to="/torneos/programacion" className="nav-link">
                <MDBIcon fas icon="calendar" className="me-1" />
                Programacion
              </NavLink>

              {/* <NavDropdown title={<span><MDBIcon fas icon="building" className="me-1" /> LCF</span>} id="dropdown-lcf">
                <NavDropdown.Item as={NavLink} to="/lcf/historia">Historia</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/lcf/mision-vision">Misión y Visión</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/lcf/organigrama">Organigrama</NavDropdown.Item>
              </NavDropdown> */}

              <NavDropdown title={<span><MDBIcon fas icon="file-invoice" className="me-1" /> Tramites</span>} id="dropdown-tramites">
                <NavDropdown.Item as={NavLink} to="/torneos/futbol">Municipal</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Sport-man</NavDropdown.Item>
              </NavDropdown>

              <NavLink to="/nuestros-afiliados" className="nav-link">
                <MDBIcon fas icon="users" className="me-1" />
                Nosotros
              </NavLink>

              <NavLink to="/nuestros-afiliados" className="nav-link">
                <MDBIcon fas icon="users" className="me-1" />
                Nuestros afiliados
              </NavLink>

              <NavLink to="/nuestros-afiliados" className="nav-link">
                <MDBIcon fas icon="users" className="me-1" />
                Contactenos
              </NavLink>
              

              {/* <NavDropdown title={<span><MDBIcon fas icon="book" className="me-1" /> Reglamentacion</span>} id="dropdown-torneos">
                <NavDropdown.Item as={NavLink} to="/torneos/futbol">Torneos de la liga</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Comisiones</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Estatutos</NavDropdown.Item>
              </NavDropdown> */}

              {/* <NavLink to="/club" className="nav-link">
                <MDBIcon fas icon="futbol" className="me-1" />
                Mi Club
              </NavLink> */}
            </Nav>
          </Navbar.Collapse>

          {/* Botón de logout fuera del Navbar.Collapse */}
          {isAuthenticated && (
            <div className="logout-button-container position-absolute end-0 top-0 pe-2 pt-1">
              <Nav.Link
                onClick={handleLogoutClick}
                className="nav-link logout-button"
              >
                <MDBIcon fas icon="sign-out-alt" title="Cerrar sesión" />
              </Nav.Link>
            </div>
          )}
        </Container>
      </Navbar>

      <ModalConfirmacion
        show={showLogoutModal}
        mensaje="¿Estás seguro de que deseas cerrar sesión?"
        onConfirm={handleConfirmLogout}
        onClose={handleCloseLogoutModal}
      />
    </>
  );
};

export default memo(NavBar);