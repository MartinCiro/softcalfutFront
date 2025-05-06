import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import {
  MDBBtn,
  MDBSpinner,
  MDBInput,
  MDBInputGroup
} from 'mdb-react-ui-kit';
import { FaEdit, FaSave, FaTimes, FaCalendarAlt, FaIdCard, FaBuilding, FaDollarSign, FaPercentage } from 'react-icons/fa';
import FacturaService from '@services/FacturaService';
import './Facturas.css';

const FacturaEditModal = ({ show, onHide, facturaId, onSuccess }) => {
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    FEV: '',
    cantidad: 0,
    subtotal: 0,
    impuestos: '',
    iva: 0,
    valor_total: 0,
    valor_total_facturado: 0,
    porcentaje_descuento: 0,
    valor_esperado: 0
  });

  useEffect(() => {
    if (show && facturaId) {
      fetchFacturaDetalle();
    }
  }, [show, facturaId]);

  const fetchFacturaDetalle = async () => {
    setLoading(true);
    setError('');
    try {
      const facturaData = await FacturaService.getFacturaById(facturaId);
      setFactura(facturaData);
      
      // Inicializar el formulario con los datos de la factura
      setFormData({
        FEV: facturaData.FEV || '',
        cantidad: facturaData.cantidad || 0,
        subtotal: facturaData.subtotal || 0,
        impuestos: facturaData.impuestos || '',
        iva: facturaData.iva || 0,
        valor_total: facturaData.valor_total || 0,
        valor_total_facturado: facturaData.valor_total_facturado || 0,
        porcentaje_descuento: facturaData.porcentaje_descuento || 0,
        valor_esperado: facturaData.valor_esperado || 0
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar los detalles de la factura:', err);
      setError(err.message || 'Error al cargar los detalles de la factura');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Convertir valores numéricos
    if (['cantidad', 'subtotal', 'iva', 'valor_total', 'valor_total_facturado', 'porcentaje_descuento', 'valor_esperado'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Crear objeto con los datos a actualizar
      const facturaActualizada = {
        ...factura,
        ...formData
      };
      
      // Llamar al servicio para actualizar la factura
      await FacturaService.updateFactura(facturaId, facturaActualizada);
      
      // Mostrar mensaje de éxito y cerrar modal
      setSaving(false);
      if (onSuccess) {
        onSuccess();
      }
      onHide();
    } catch (err) {
      console.error('Error al actualizar la factura:', err);
      setError(err.message || 'Error al actualizar la factura');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaEdit className="me-2" />Editar Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <MDBSpinner role="status">
            <span className="visually-hidden">Cargando...</span>
          </MDBSpinner>
          <p className="mt-3">Cargando detalles de la factura...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><FaEdit className="me-2" />Editar Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5 className="mb-3">Información General</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaEdit className="me-2" />} textAfter="Número">
                  <MDBInput
                    name="FEV"
                    value={formData.FEV}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="Subtotal">
                  <MDBInput
                    type="number"
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="Cantidad">
                  <MDBInput
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="Impuestos">
                  <MDBInput
                    name="impuestos"
                    value={formData.impuestos}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="IVA">
                  <MDBInput
                    type="number"
                    name="iva"
                    value={formData.iva}
                    onChange={handleInputChange}
                  />
                </MDBInputGroup>
              </div>
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="Valor Total">
                  <MDBInput
                    type="number"
                    name="valor_total"
                    value={formData.valor_total}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="Valor Facturado">
                  <MDBInput
                    type="number"
                    name="valor_total_facturado"
                    value={formData.valor_total_facturado}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaPercentage className="me-2" />} textAfter="% Descuento">
                  <MDBInput
                    type="number"
                    name="porcentaje_descuento"
                    value={formData.porcentaje_descuento}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInputGroup textBefore={<FaDollarSign className="me-2" />} textAfter="Valor Esperado">
                  <MDBInput
                    type="number"
                    name="valor_esperado"
                    value={formData.valor_esperado}
                    onChange={handleInputChange}
                    required
                  />
                </MDBInputGroup>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <MDBBtn color="secondary" className="me-2" onClick={onHide} disabled={saving}>
              <FaTimes className="me-2" />Cancelar
            </MDBBtn>
            <MDBBtn type="submit" color="success" disabled={saving}>
              {saving ? (
                <>
                  <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="me-2" />Guardar Cambios
                </>
              )}
            </MDBBtn>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FacturaEditModal;