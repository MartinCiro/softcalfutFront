import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { MDBIcon, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { FaSave, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CausacionService from '@services/CausacionService';

const ConfiguracionCausacion = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [camposCausacion, setCamposCausacion] = useState([]);

  // Estructura de datos para DocumentoCompraServicios.json
  const secciones = [
    {
      nombre: 'Doctocompraservicios',
      campos: [
        'F_CIA', 'F_LIQUIDA_IMPUESTO', 'F_LIQUIDA_RETENCION', 'F_CONSEC_AUTO_REG',
        'F350_ID_CO', 'F350_ID_TIPO_DOCTO', 'F350_CONSEC_DOCTO', 'F350_FECHA',
        'F350_ID_TERCERO', 'F350_ID_CLASE_DOCTO', 'F350_IND_ESTADO', 'F350_IND_IMPRESION',
        'F350_NOTAS', 'F311_ID_SUCURSAL_PROV', 'F311_ID_TIPO_PROV', 'F311_FECHA_DOCTO_PROV',
        'F311_PREFIJO_DOCTO_PROV', 'F311_NUMERO_DOCTO_PROV', 'F311_ID_COND_PAGO',
        'F311_REFERENCIA', 'F311_ID_MONEDA_DOCTO', 'F311_ID_MONEDA_CONV', 'F311_TASA_CONV',
        'F311_ID_MONEDA_LOCAL', 'F311_TASA_LOCAL', 'F311_VLR_DIFER', 'F311_VLR_DIFER_ALT',
        'F311_IND_CONTABILIZA_X_CO', 'F311_ID_UN', 'F311_ID_CCOSTO', 'F311_ID_CPTO_FE'
      ]
    },
    {
      nombre: 'Impuestos',
      campos: [
        'F_CIA', 'F350_ID_CO', 'F350_ID_TIPO_DOCTO', 'F350_CONSEC_DOCTO', 'F320_ROWID',
        'F321_ID_LLAVE_IMPUESTO', 'F321_PORCENTAJE_BASE', 'F321_TASA', 'F321_VLR_UNI',
        'F321_VLR_TOT', 'F321_IND_DESCONTABLE', 'F321_IND_ACCION', 'F321_IND_CALCULO',
        'F321_ID_LLAVE_IMPUESTO_DESC', 'F321_PORCENTAJE_BASE_DESC', 'F321_TASA_DESC',
        'F321_PORC_IMP_VALOR_DESC', 'F321_VLR_TOT_DESC'
      ]
    },
    {
      nombre: 'Retenciones',
      campos: [
        'F_CIA', 'F350_ID_CO', 'F350_ID_TIPO_DOCTO', 'F350_CONSEC_DOCTO',
        'F314_ID_LLAVE_RETENCION', 'F314_PORCENTAJE_BASE', 'F314_ID_CLASE_IMP_BASE',
        'F314_BASE_MIN_MONEDA_DOCTO', 'F314_TASA', 'F314_VLR_BASE', 'F314_VLR_RET',
        'F314_IND_ACCION'
      ]
    },
    {
      nombre: 'CuotasCxP',
      campos: [
        'F_CIA', 'F350_ID_CO', 'F350_ID_TIPO_DOCTO', 'F350_CONSEC_DOCTO',
        'F353_PREFIJO_CRUCE', 'F353_CONSEC_DOCTO_CRUCE', 'F353_NRO_CUOTA_CRUCE',
        'F353_VLR_CRUCE', 'F_PORCENTAJE_CUOTA', 'F353_FECHA_VCTO', 'F_PORCENTAJE_PP',
        'F353_FECHA_DSCTO_PP'
      ]
    },
    {
      nombre: 'Movtocompraservicios',
      campos: [
        'F_CIA', 'F350_ID_CO', 'F350_ID_TIPO_DOCTO', 'F350_CONSEC_DOCTO', 'F320_ROWID',
        'F320_ID_SERVICIO', 'F320_ID_MOTIVO', 'F320_ID_CO_MOVTO', 'F320_ID_UN_MOVTO',
        'F320_ID_CCOSTO_MOVTO', 'F320_ID_TERCERO_MOVTO', 'F320_ID_SUCURSAL_CLIENTE',
        'F320_ID_SUCURSAL_PROVEEDOR', 'F320_CANTIDAD', 'F320_VLR_BRUTO'
      ]
    }
  ];

  useEffect(() => {
    // Cargar configuración guardada o inicializar con valores por defecto
    const cargarConfiguracion = async () => {
      setLoading(true);
      try {
        // Obtener la configuración guardada
        const config = await CausacionService.getCausacionConfig();
        
        if (config && config.campos && config.campos.length > 0) {
          // Si hay configuración guardada, usarla
          setCamposCausacion(config.campos);
        } else {
          // Si no hay configuración guardada, inicializar con valores por defecto
          const camposIniciales = [];
          
          secciones.forEach(seccion => {
            seccion.campos.forEach(campo => {
              camposIniciales.push({
                seccion: seccion.nombre,
                campo: campo,
                mostrar: false,
                valor: '',
                bloqueado: false
              });
            });
          });
          
          setCamposCausacion(camposIniciales);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar la configuración de causación:', err);
        setError('Error al cargar la configuración de causación');
        setLoading(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const handleCheckboxChange = (index) => {
    const nuevosCampos = [...camposCausacion];
    nuevosCampos[index].mostrar = !nuevosCampos[index].mostrar;
    setCamposCausacion(nuevosCampos);
  };

  const handleInputChange = (index, field, value) => {
    const nuevosCampos = [...camposCausacion];
    nuevosCampos[index][field] = value;
    setCamposCausacion(nuevosCampos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Guardar la configuración usando el servicio
      await CausacionService.saveCausacionConfig(camposCausacion);
      
      setSuccess('Configuración de causación guardada con éxito');
      toast.success('Configuración de causación guardada con éxito');
      setSaving(false);
    } catch (err) {
      console.error('Error al guardar la configuración de causación:', err);
      setError('Error al guardar la configuración de causación: ' + (err.response?.data?.error || err.message));
      toast.error('Error al guardar la configuración de causación');
      setSaving(false);
    }
  };

  const resetearConfiguracion = () => {
    const confirmacion = window.confirm('¿Está seguro de que desea resetear la configuración? Se perderán todos los cambios no guardados.');
    if (confirmacion) {
      const camposReseteados = camposCausacion.map(campo => ({
        ...campo,
        mostrar: false,
        valor: '',
        bloqueado: false
      }));
      setCamposCausacion(camposReseteados);
      toast.info('Configuración reseteada');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <MDBSpinner role="status">
          <span className="visually-hidden">Cargando...</span>
        </MDBSpinner>
        <p className="mt-3">Cargando configuración de causación...</p>
      </div>
    );
  }

  return (
    <Card className="mb-4 config-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <MDBIcon fas icon="cogs" className="me-2" />
          Configuración de Causación
        </h5>
        <div>
          <MDBBtn color="secondary" className="me-2" onClick={resetearConfiguracion}>
            <FaUndo className="me-2" />Resetear
          </MDBBtn>
          <MDBBtn color="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                Guardando...
              </>
            ) : (
              <>
                <FaSave className="me-2" />Guardar Configuración
              </>
            )}
          </MDBBtn>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <p className="mb-3">
          Seleccione los campos que desea mostrar en la ventana de causación de facturas. 
          Para cada campo puede establecer un valor predeterminado y si el campo debe estar bloqueado para edición.
        </p>
        
        <Form onSubmit={handleSubmit}>
          {secciones.map((seccion, seccionIndex) => (
            <div key={seccionIndex} className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">{seccion.nombre}</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}>Mostrar</th>
                    <th style={{ width: '30%' }}>Campo</th>
                    <th style={{ width: '45%' }}>Valor Predeterminado</th>
                    <th style={{ width: '20%' }}>Bloquear Campo</th>
                  </tr>
                </thead>
                <tbody>
                  {camposCausacion
                    .filter(campo => campo.seccion === seccion.nombre)
                    .map((campo) => {
                      const index = camposCausacion.findIndex(
                        c => c.seccion === campo.seccion && c.campo === campo.campo
                      );
                      return (
                        <tr key={`${seccion.nombre}-${campo.campo}`}>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              checked={campo.mostrar}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                          <td>{campo.campo}</td>
                          <td>
                            <Form.Control
                              type="text"
                              value={campo.valor}
                              onChange={(e) => handleInputChange(index, 'valor', e.target.value)}
                              disabled={!campo.mostrar}
                            />
                          </td>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              checked={campo.bloqueado}
                              onChange={() => handleInputChange(index, 'bloqueado', !campo.bloqueado)}
                              disabled={!campo.mostrar}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ConfiguracionCausacion;