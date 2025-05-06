import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import SiesaDropdown from '../common/SiesaDropdown.jsx';

const ConfiguracionCausacion = () => {
  const [configuracion, setConfiguracion] = useState({
    Doctocompraservicios: {
      F_CIA: { valor: "001", mostrar: true },
      F_LIQUIDA_IMPUESTO: { valor: "", mostrar: true },
      F_LIQUIDA_RETENCION: { valor: "0", mostrar: true },
      F_CONSEC_AUTO_REG: { valor: "1", mostrar: true },
      F350_ID_CO: { valor: "099", mostrar: true },
      F350_ID_TIPO_DOCTO: { valor: "GP", mostrar: true },
      F350_CONSEC_DOCTO: { valor: "00000000", mostrar: false },
      F350_FECHA: { valor: "", mostrar: true },
      F350_ID_TERCERO: { valor: "", mostrar: false },
      F350_ID_CLASE_DOCTO: { valor: "021", mostrar: true },
      // ... otros campos según sea necesario
    }
  });
  
  const handleChange = (seccion, campo, valor) => {
    setConfiguracion(prevConfig => ({
      ...prevConfig,
      [seccion]: {
        ...prevConfig[seccion],
        [campo]: {
          ...prevConfig[seccion][campo],
          valor
        }
      }
    }));
  };
  
  const handleSiesaDropdownChange = (seccion, campo, valor) => {
    handleChange(seccion, campo, valor);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración guardada:', configuracion);
  };
  
  return (
    <Container>
      <h2 className="my-4">Configuración de Causación - Documento Compra Servicios</h2>
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header>Documento Compra Servicios</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Compañía (F_CIA)</Form.Label>
                  <Form.Control
                    type="text"
                    value={configuracion.Doctocompraservicios.F_CIA.valor}
                    onChange={(e) => handleChange('Doctocompraservicios', 'F_CIA', e.target.value)}
                    disabled={true} // Bloqueado por ser valor por defecto
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Liquidar Impuesto (F_LIQUIDA_IMPUESTO)</Form.Label>
                  <Form.Control
                    as="select"
                    value={configuracion.Doctocompraservicios.F_LIQUIDA_IMPUESTO.valor}
                    onChange={(e) => handleChange('Doctocompraservicios', 'F_LIQUIDA_IMPUESTO', e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    <option value="0">No</option>
                    <option value="1">Sí</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Liquidar Retención (F_LIQUIDA_RETENCION)</Form.Label>
                  <Form.Control
                    as="select"
                    value={configuracion.Doctocompraservicios.F_LIQUIDA_RETENCION.valor}
                    onChange={(e) => handleChange('Doctocompraservicios', 'F_LIQUIDA_RETENCION', e.target.value)}
                  >
                    <option value="0">No</option>
                    <option value="1">Sí</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consecutivo (F_CONSEC_AUTO_REG)</Form.Label>
                  <Form.Control
                    as="select"
                    value={configuracion.Doctocompraservicios.F_CONSEC_AUTO_REG.valor}
                    onChange={(e) => handleChange('Doctocompraservicios', 'F_CONSEC_AUTO_REG', e.target.value)}
                  >
                    <option value="0">Manual</option>
                    <option value="1">Automático</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                {/* Aquí usamos el componente SiesaDropdown para F350_ID_CO */}
                <SiesaDropdown
                  tipoConsulta="MAESTRO_CO"
                  valorInicial={configuracion.Doctocompraservicios.F350_ID_CO.valor}
                  onChange={(valor) => handleSiesaDropdownChange('Doctocompraservicios', 'F350_ID_CO', valor)}
                  label="Centro Operativo (F350_ID_CO)"
                  required={true}
                />
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo Documento (F350_ID_TIPO_DOCTO)</Form.Label>
                  <Form.Control
                    type="text"
                    value={configuracion.Doctocompraservicios.F350_ID_TIPO_DOCTO.valor}
                    onChange={(e) => handleChange('Doctocompraservicios', 'F350_ID_TIPO_DOCTO', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {/* Aquí irían más campos según sea necesario */}
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-end mb-4">
          <Button variant="primary" type="submit">
            Guardar Configuración
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ConfiguracionCausacion;