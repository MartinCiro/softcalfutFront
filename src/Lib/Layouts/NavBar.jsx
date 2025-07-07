import React, { useCallback } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';
import { NavLink, useNavigate } from 'react-router-dom';
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import '@styles/NavBar.css';
import { useAuth } from '@hooks/AuthContext';
import AuthService from '@services/AuthService';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = useCallback(() => setShowLogoutModal(true), []);

  const handleConfirmLogout = useCallback(() => {
    AuthService.logout(navigate);
    setShowLogoutModal(false);
  }, [logout, navigate]);

  const handleCloseLogoutModal = useCallback(() => setShowLogoutModal(false), []);
  const displayName = isAuthenticated ? (user?.usuario?.nombre || 'Usuario') : 'LCF';

  return (
    <>
      <Navbar expand="lg" className="navbar-custom" data-bs-theme="dark" collapseOnSelect>
        <Container>
          <div className="d-none d-lg-flex align-items-center me-4 user-name-lg">
            <span className="text-light">{displayName}</span>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <div className="d-flex align-items-center mobile-elements">
            {/* Nombre del usuario para pantallas móviles (centrado) */}

            <div className="user-name-sm">
              <span className="text-light">{displayName}</span>
            </div>


            {isAuthenticated && (
              <div className="logout-button-mobile">
                <Nav.Link
                  onClick={handleLogoutClick}
                  className="nav-link logout-button"
                >
                  <MDBIcon fas icon="sign-out-alt" title="Cerrar sesión" />
                </Nav.Link>
              </div>
            )}
          </div>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto d-flex gap-4 align-items-center">
              <NavLink to="/" className="nav-link">
                <MDBIcon fas icon="home" className="me-1" />
                Inicio
              </NavLink>

              <NavDropdown title={<span><MDBIcon fas icon="building" className="me-1" /> LCF</span>} id="dropdown-lcf">
                <NavDropdown.Item as={NavLink} to="/lcf/historia">Historia</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/lcf/mision-vision">Misión y Visión</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/lcf/organigrama">Organigrama</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title={<span><MDBIcon fas icon="trophy" className="me-1" /> Torneos</span>} id="dropdown-torneos">
                <NavDropdown.Item as={NavLink} to="/torneos/futbol">Fútbol</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/futbol-sala">Fútbol Sala</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/torneos/programacion">Programacion</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title={<span><MDBIcon fas icon="book" className="me-1" /> Escuela LCF</span>} id="dropdown-escuela">
                <NavDropdown.Item as={NavLink} to="/escuela/formacion">Escuela de Formación</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/escuela/acerca">Acerca de la Escuela</NavDropdown.Item>
              </NavDropdown>

              <NavLink to="/club" className="nav-link">
                <MDBIcon fas icon="futbol" className="me-1" />
                Mi Club
              </NavLink>
            </Nav>
          </Navbar.Collapse>

          {/* Botón de logout fuera del Navbar.Collapse */}
          {isAuthenticated && (
            <div className="logout-button-lg ms-auto d-none d-lg-flex">
              <Nav.Link
                onClick={handleLogoutClick}
                className="nav-link"
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

export default React.memo(NavBar);