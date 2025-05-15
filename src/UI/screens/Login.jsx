import React, { useState } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import '@styles/Login.css';
import mainLogo from '@assets/logos/main_logo.png';
import logoPositiva from '@assets/logos/Positiva.png';
import backgroundImage from '@assets/img/background.svg';

import AuthService from '@services/AuthService';
import useFormSubmitter from '@hooks/useFormSubmitter';


const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const { submitForm, error } = useFormSubmitter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submitForm(
      () => AuthService.login(formData.correo, formData.password),
      '/dashboard'
    );
  };

  return (
    <div className="login-container">
      <MDBContainer fluid className="p-3 my-5 login-animation">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="12" md="10" lg="9" xl="8" className="m-0 p-0">
            <MDBCard className="login-card p-0 overflow-hidden">
              <MDBRow className="g-0">
                {/* Formulario a la izquierda (45%) */}
                <MDBCol md="5" lg="5" xl="5">
                  <MDBCardBody className="p-5">
                    <div className="text-center mb-4">
                      <img 
                        src={mainLogo} 
                        alt="Inteligencia de Datos Logo" 
                        style={{ maxWidth: '250px', marginBottom: '20px' }} 
                        className="img-fluid"
                      />
                      <img 
                        src={logoPositiva} 
                        alt="Logo Positiva" 
                        style={{ maxWidth: '150px', marginBottom: '10px' }} 
                        className="img-fluid"
                      />
                    </div>
                    
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
                        style={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #243E6E',
                          borderRadius: '8px',
                          padding: '12px 15px',
                          color: '#000000',
                          WebkitTextFillColor: '#000000'
                        }}
                      />
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Contraseña'
                        id='password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='login-input'
                        style={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #243E6E',
                          borderRadius: '8px',
                          padding: '12px 15px',
                          color: '#000000',
                          WebkitTextFillColor: '#000000'
                        }}
                      />

                      <div className="d-flex justify-content-between mx-1 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Recordarme' />
                        <a href="#!" className="login-link">¿Olvidó su contraseña?</a>
                      </div>

                      <MDBBtn type="submit" className="mb-4 w-100 py-3 login-button">
                        Iniciar sesión
                      </MDBBtn>
                      
                        <div className="text-center">
                            <p style={{ color: '#0D1828', fontSize: '0.9rem' }}>
                                © {new Date().getFullYear()} Inteligencia de Datos
                            </p>
                        </div>
                    </form>
                  </MDBCardBody>
                </MDBCol>
                
                {/* Imagen a la derecha (55%) */}
                <MDBCol md="7" lg="7" xl="7" className="d-none d-md-block p-0">
                  <img 
                    src={backgroundImage} 
                    alt="Background" 
                    className="login-background-image" 
                    style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '0 15px 15px 0' }}
                  />
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Login;