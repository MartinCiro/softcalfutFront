import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Configuracion.css';
import ConfiguracionCausacion from './ConfiguracionCausacion';

const Configuracion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [configuracion, setConfiguracion] = useState({
    nombreEmpresa: 'Mi Empresa',
    correoContacto: 'contacto@miempresa.com',
    telefonoContacto: '(+57) 300 123 4567',
    direccion: 'Calle Principal #123',
    logoUrl: '',
    colorPrimario: '#007bff',
    colorSecundario: '#6c757d',
    diasRetencionDatos: 90,
    notificacionesEmail: true,
    modoMantenimiento: false
  });

  useEffect(() => {
    // Aquí se cargarían las configuraciones desde el backend
    // Por ahora usamos los valores por defecto
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracion({
      ...configuracion,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Aquí se implementaría la llamada al servicio para guardar la configuración
      // await ConfiguracionService.saveConfiguracion(configuracion);
      
      // Simulamos una espera
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Configuración guardada con éxito');
      toast.success('Configuración guardada con éxito');
    } catch (err) {
      console.error('Error al guardar la configuración:', err);
      setError('Error al guardar la configuración');
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4">Configuración del Sistema</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {/* Sección de Configuración de Causación */}
      <ConfiguracionCausacion />
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Card className="mb-4 config-card">
              <Card.Header>Información General</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Empresa</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombreEmpresa"
                    value={configuracion.nombreEmpresa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo de Contacto</Form.Label>
                  <Form.Control
                    type="email"
                    name="correoContacto"
                    value={configuracion.correoContacto}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono de Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefonoContacto"
                    value={configuracion.telefonoContacto}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={configuracion.direccion}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4 config-card">
              <Card.Header>Apariencia</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>URL del Logo</Form.Label>
                  <Form.Control
                    type="text"
                    name="logoUrl"
                    value={configuracion.logoUrl}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Color Primario</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="color"
                          name="colorPrimario"
                          value={configuracion.colorPrimario}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <Form.Control
                          type="text"
                          value={configuracion.colorPrimario}
                          onChange={(e) => handleChange({
                            target: { name: 'colorPrimario', value: e.target.value }
                          })}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Color Secundario</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="color"
                          name="colorSecundario"
                          value={configuracion.colorSecundario}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <Form.Control
                          type="text"
                          value={configuracion.colorSecundario}
                          onChange={(e) => handleChange({
                            target: { name: 'colorSecundario', value: e.target.value }
                          })}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4 config-card">
              <Card.Header>Configuración del Sistema</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Días de Retención de Datos</Form.Label>
                  <Form.Control
                    type="number"
                    name="diasRetencionDatos"
                    value={configuracion.diasRetencionDatos}
                    onChange={handleChange}
                    min="1"
                    max="365"
                  />
                  <Form.Text className="text-muted">
                    Número de días que se conservarán los datos antes de ser archivados.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="notificaciones-email"
                    label="Notificaciones por Email"
                    name="notificacionesEmail"
                    checked={configuracion.notificacionesEmail}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Enviar notificaciones por correo electrónico a los usuarios.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="modo-mantenimiento"
                    label="Modo Mantenimiento"
                    name="modoMantenimiento"
                    checked={configuracion.modoMantenimiento}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Activar el modo de mantenimiento (solo administradores podrán acceder).
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4 config-card">
              <Card.Header>Respaldo y Restauración</Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <Button variant="outline-primary" className="w-100 mb-2">
                    Crear Respaldo de Datos
                  </Button>
                  <Form.Text className="text-muted">
                    Crea una copia de seguridad de todos los datos del sistema.
                  </Form.Text>
                </div>

                <div className="mb-3">
                  <Form.Label>Restaurar desde Respaldo</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".zip,.sql,.json"
                  />
                  <Form.Text className="text-muted">
                    Seleccione un archivo de respaldo para restaurar el sistema.
                  </Form.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3 mb-5">
          <Button variant="secondary" className="me-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar Configuración'
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Configuracion;