import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import {
  MDBBtn,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { FaFilePdf, FaTimes, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import FacturaService from '@services/FacturaService';
import './Facturas.css';

const FacturaPDFModal = ({ show, onHide, facturaId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (show && facturaId) {
      setLoading(true);
      setError('');
      
      // Usar un bloque async/await dentro de un IIFE para manejar promesas
      (async () => {
        try {
          // Verificar primero si el PDF está disponible
          console.log('Verificando disponibilidad del PDF para factura:', facturaId);
          
          // Obtener la URL del PDF usando el servicio
          const url = await FacturaService.getFacturaPDF(facturaId);
          console.log('URL del PDF obtenida:', url ? 'URL válida' : 'URL no válida');
          
          if (!url) {
            throw new Error('No se pudo obtener la URL del PDF');
          }
          
          // Verificar si la URL es un string base64 sin el prefijo data:application/pdf
          if (url.startsWith('data:application/pdf;base64,')) {
            console.log('PDF en formato data URL, listo para visualizar');
            setPdfUrl(url);
          } else if (url.startsWith('http')) {
            console.log('PDF en formato URL, listo para visualizar');
            setPdfUrl(url);
          } else {
            console.log('Intentando procesar contenido base64 del PDF');
            try {
              // Asumimos que es un string base64 sin el prefijo adecuado
              const base64Clean = url.replace(/\s/g, '');
              // Verificar que sea un base64 válido intentando decodificarlo
              atob(base64Clean);
              // Si llegamos aquí, es un base64 válido, añadimos el prefijo
              setPdfUrl(`data:application/pdf;base64,${base64Clean}`);
            } catch (base64Error) {
              console.error('Error al procesar contenido base64:', base64Error);
              throw new Error('El formato del PDF no es compatible con el visualizador.');
            }
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error al obtener la URL del PDF:', err);
          // Mensaje de error más amigable para el usuario
          if (err.message.includes('no está disponible')) {
            setError('Esta factura no tiene un PDF asociado.');
          } else if (err.message.includes('no existe en el servidor')) {
            setError('El archivo PDF no se encuentra en el servidor.');
          } else if (err.message.includes('formato')) {
            setError('El formato del PDF no es compatible con el visualizador.');
          } else if (err.message.includes('base64')) {
            setError('El contenido del PDF está en un formato no válido.');
          } else {
            setError(err.message || 'Error al cargar el PDF de la factura');
          }
          setLoading(false);
        }
      })();
    } else {
      // Reiniciar estado cuando se cierra el modal
      setPdfUrl('');
      setError('');
      setLoading(true);
    }
  }, [show, facturaId]);

  const handleDownload = () => {
    if (pdfUrl) {
      // Crear un enlace temporal para descargar el PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `factura-${facturaId}.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleView = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaFilePdf className="me-2" />Visualizador de PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <MDBSpinner role="status">
            <span className="visually-hidden">Cargando...</span>
          </MDBSpinner>
          <p className="mt-3">Cargando PDF de la factura...</p>
        </Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaFilePdf className="me-2" />Visualizador de PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pdf-preview-container text-center">
            <div className="pdf-icon-container mb-4">
              <FaExclamationTriangle size={64} color="#dc3545" />
            </div>
            <h4 className="mb-3">No se pudo cargar el PDF</h4>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <div className="alert alert-info mt-3" role="alert">
              <strong>Sugerencias:</strong>
              <ul className="mb-0 mt-2">
                <li>Verifique que la factura tenga un PDF asociado en el sistema</li>
                <li>Compruebe su conexión a internet</li>
                <li>Intente recargar la página</li>
                <li>Si el problema persiste, contacte al administrador del sistema</li>
              </ul>
            </div>
            <p className="mt-3 text-muted">
              Es posible que esta factura no tenga un PDF asociado o que el formato no sea compatible.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <MDBBtn color="secondary" onClick={onHide}>
            <FaTimes className="me-2" />Cerrar
          </MDBBtn>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="pdf-modal">
      <Modal.Header closeButton>
        <Modal.Title><FaFilePdf className="me-2" />Visualizador de PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pdfUrl ? (
          <div className="pdf-container">
            {/* Utilizamos un objeto para mostrar el PDF de forma segura */}
            <object
              data={pdfUrl}
              type="application/pdf"
              className="pdf-iframe"
              title="Visualizador de PDF"
            >
              <div className="pdf-preview-container text-center">
                <div className="pdf-icon-container mb-4">
                  <FaExclamationTriangle size={64} color="#dc3545" />
                </div>
                <p className="text-muted mb-4">
                  Su navegador no puede mostrar el PDF directamente.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <MDBBtn color="primary" onClick={handleView}>
                    <FaFilePdf className="me-2" />Ver PDF en nueva pestaña
                  </MDBBtn>
                  <MDBBtn color="success" onClick={handleDownload}>
                    <FaDownload className="me-2" />Descargar PDF
                  </MDBBtn>
                </div>
              </div>
            </object>
          </div>
        ) : (
          <div className="pdf-preview-container">
            <div className="pdf-icon-container mb-4">
              <FaFilePdf size={64} color="#dc3545" />
            </div>
            <h4 className="mb-3">Factura #{facturaId}</h4>
            <p className="text-muted mb-4">
              <FaExclamationTriangle className="me-2" />
              El PDF no puede mostrarse directamente en esta ventana.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <MDBBtn color="primary" onClick={handleView}>
                <FaFilePdf className="me-2" />Ver PDF en nueva pestaña
              </MDBBtn>
              <MDBBtn color="success" onClick={handleDownload}>
                <FaDownload className="me-2" />Descargar PDF
              </MDBBtn>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <MDBBtn color="secondary" onClick={onHide}>
          <FaTimes className="me-2" />Cerrar
        </MDBBtn>
      </Modal.Footer>
    </Modal>
  );
};

export default FacturaPDFModal;