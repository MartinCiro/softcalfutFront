import React, { useState } from 'react';
import { Modal, Form, Alert } from 'react-bootstrap';
import {
  MDBBtn,
  MDBIcon,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { FaUpload, FaFileAlt, FaTimes, FaCheck } from 'react-icons/fa';
import FacturaService from '@services/FacturaService';

const UploadFacturaModal = ({ show, onHide, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/xml') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Por favor, seleccione un archivo XML válido');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, seleccione un archivo XML');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Leer el archivo como texto
      const reader = new FileReader();
      reader.onload = async (event) => {
        const xmlString = event.target.result;
        
        try {
          // Enviar el XML al backend usando el servicio
          await FacturaService.uploadFacturaXML(xmlString);

          setSuccess(true);
          setLoading(false);
          
          // Notificar al componente padre que la carga fue exitosa
          if (onSuccess) {
            setTimeout(() => {
              onHide();
              onSuccess();
            }, 1500);
          }
        } catch (err) {
          console.error('Error al procesar el XML:', err);
          setError(err.message || 'Error al procesar el archivo XML');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error al leer el archivo');
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (err) {
      console.error('Error en la carga del archivo:', err);
      setError('Error al cargar el archivo');
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title><FaFileAlt className="me-2" />Cargar Factura XML</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Factura cargada exitosamente</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Seleccione el archivo XML de la factura</Form.Label>
            <Form.Control 
              type="file" 
              accept=".xml,text/xml" 
              onChange={handleFileChange} 
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Solo se aceptan archivos en formato XML
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <MDBBtn color="secondary" onClick={onHide} disabled={loading}>
          <FaTimes className="me-1" /> Cancelar
        </MDBBtn>
        <MDBBtn color="primary" onClick={handleSubmit} disabled={loading || !file}>
          {loading ? (
            <>
              <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
              Procesando...
            </>
          ) : (
            <>
              <FaUpload className="me-1" /> Cargar Factura
            </>
          )}
        </MDBBtn>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadFacturaModal;