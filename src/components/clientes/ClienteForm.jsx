import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import ClienteService from '@services/ClienteService';

const ClienteForm = ({ show, handleClose, cliente, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nit: '',
    razonSocial: '',
    tipoTributacion: 'Régimen Simple'
  });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente && isEditing) {
      setFormData({
        nit: cliente.nit || '',
        razonSocial: cliente.razonSocial || '',
        tipoTributacion: cliente.tipoTributacion || 'Régimen Simple'
      });
    } else {
      // Reset form when opening in create mode
      setFormData({
        nit: '',
        razonSocial: '',
        tipoTributacion: 'Régimen Simple'
      });
    }
    setValidated(false);
    setError('');
  }, [cliente, isEditing, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      if (isEditing) {
        result = await ClienteService.updateCliente(cliente.id, formData);
      } else {
        result = await ClienteService.createCliente(formData);
      }
      
      onSave(result);
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>NIT</Form.Label>
            <Form.Control
              type="text"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              required
              disabled={isEditing}
              placeholder="Ingrese el NIT"
            />
            <Form.Control.Feedback type="invalid">
              El NIT es requerido
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              required
              placeholder="Ingrese la razón social"
            />
            <Form.Control.Feedback type="invalid">
              La razón social es requerida
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Tributación</Form.Label>
            <Form.Select
              name="tipoTributacion"
              value={formData.tipoTributacion}
              onChange={handleChange}
              required
            >
              <option value="Régimen Simple">Régimen Simple</option>
              <option value="Régimen Común">Régimen Común</option>
              <option value="Gran Contribuyente">Gran Contribuyente</option>
              <option value="Otro">Otro</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClienteForm;