import React, { useState } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';
import '@styles/Login.css';
import AuthService from '@services/AuthService';
import { useAuth } from '@hooks/AuthContext';
import useWhatsAppRedirect from "@hooks/useWhatsAppRedirect";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const wsp = useWhatsAppRedirect();
  const navigate = useNavigate();
  const url = wsp("+573136547420", "Hola, he perdido mi contraseña de LCF");
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.correo, formData.password, navigate);
    } catch (error) {
      setError(
        error.friendlyMessage ||
        error.message ||
        'Error al iniciar sesión. Por favor verifica tus credenciales'
      );
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="login-container">
      <MDBContainer fluid className="p-3 my-5 login-animation">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="12" md="10" lg="9" xl="8" className="m-0 p-0">
            <MDBCard className="login-card p-0 overflow-hidden">
              <MDBRow className="g-0">
                {/* Formulario a la izquierda (45%) */}
                <MDBCardBody className="p-5">
                  <h2 className="fw-bold mb-5 login-title text-center">Iniciar Sesión</h2>
                  {error && (
                    <div className="alert login-error" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Documento de identidad'
                      id='correo'
                      name='correo'
                      type='text'
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      className='login-input'
                    />

                    <div className="position-relative">
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Contraseña'
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='login-input'
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute"
                        style={{ right: '10px', top: '10px', zIndex: 10 }}
                        onClick={toggleShowPassword}
                      >
                        <MDBIcon icon={showPassword ? 'eye-slash' : 'eye'} />
                      </button>
                    </div>

                    <div className="d-flex justify-content-between mx-1 mb-4">
                      <a onClick={(e) => {
                        e.preventDefault();
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }} className="login-link">¿Olvidó su contraseña?</a>
                    </div>

                    <MDBBtn type="submit" className="mb-4 w-100 py-3 login-button">
                      Iniciar sesión
                    </MDBBtn>

                    <div className="text-center">
                      <p style={{ color: '#0D1828', fontSize: '0.9rem' }}>
                        Softcaltut ©{new Date().getFullYear()}
                      </p>
                    </div>
                  </form>
                </MDBCardBody>

              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Login;