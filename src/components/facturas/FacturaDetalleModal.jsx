import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
  MDBBadge
} from 'mdb-react-ui-kit';
import { FaFileInvoiceDollar, FaCalendarAlt, FaIdCard, FaBuilding, FaDollarSign, FaBoxOpen, FaPercentage, FaTimes } from 'react-icons/fa';
import FacturaService from '@services/FacturaService';
import './Facturas.css';

const FacturaDetalleModal = ({ show, onHide, facturaId }) => {
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (show) fetchFacturaDetalle();
  }, [show, facturaId]);

  const fetchFacturaDetalle = async () => {
    setLoading(true);
    setError('');
    try {
      const facturaData = await FacturaService.getFacturaById(facturaId);
      setFactura(facturaData);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar los detalles de la factura:', err);
      setError(err.message || 'Error al cargar los detalles de la factura');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaFileInvoiceDollar className="me-2" />Detalles de la Factura</Modal.Title>
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

  if (error) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaFileInvoiceDollar className="me-2" />Detalles de la Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-danger" role="alert">
            {error}
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
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><FaFileInvoiceDollar className="me-2" />Detalles de la Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {factura ? (
          <div className="factura-detalle">
            <h4 className="mb-4">Información General</h4>
            <MDBTable bordered className="mb-4">
              <MDBTableBody>
                <tr>
                  <th scope="row" width="30%"><FaFileInvoiceDollar className="me-2" />Número de Factura</th>
                  <td>{factura.FEV}</td>
                </tr>
                <tr>
                  <th scope="row"><FaCalendarAlt className="me-2" />Fecha de Emisión</th>
                  <td>
                    {factura.fecha_emision ? factura.fecha_emision : 'Sin fecha'}
                  </td>
                </tr>
                <tr>
                  <th scope="row"><FaCalendarAlt className="me-2" />Fecha de Vencimiento</th>
                  <td>
                    {factura.fecha_vencimiento ? factura.fecha_vencimiento : 'Sin fecha'}
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>

            <div className="row mb-4">
              <div className="col-md-6">
                <h4 className="mb-3">Información del Vendedor</h4>
                <MDBTable bordered>
                  <MDBTableBody>
                    <tr>
                      <th scope="row"><FaIdCard className="me-2" />NIT</th>
                      <td>
                        {factura.nit_vendedor ? factura.nit_vendedor : 'Sin información'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row"><FaBuilding className="me-2" />Razón Social</th>
                      <td>
                        {factura.razon_social_vendedor ? factura.razon_social_vendedor : 'Sin información'}
                      </td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </div>
              <div className="col-md-6">
                <h4 className="mb-3">Información del Comprador</h4>
                <MDBTable bordered>
                  <MDBTableBody>
                    <tr>
                      <th scope="row"><FaIdCard className="me-2" />NIT</th>
                      <td>
                        {factura.nit_comprador ? factura.nit_comprador : 'Sin información'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row"><FaBuilding className="me-2" />Razón Social</th>
                      <td>
                        {factura.razon_social_comprador ? factura.razon_social_comprador : 'Sin información'}
                      </td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </div>
            </div>

            <h4 className="mb-3">Información del Producto</h4>
            <MDBTable bordered className="mb-4">
              <MDBTableHead>
                <tr>
                  <th><FaBoxOpen className="me-2" />Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {factura.producto ? (
                  <tr>
                    <td>
                      {factura.producto_descripcion ? factura.producto_descripcion : 'Sin información'}
                    </td>
                    <td>
                      {factura.cantidad ? factura.cantidad : 0}
                    </td>
                    <td>
                      {factura.producto_precio ? factura.producto_precio : '$0.00'}
                    </td>
                    <td>
                      {factura.subtotal ? `$${parseFloat(factura.subtotal).toFixed(2)}` : '$0.00'}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No hay información del producto</td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>

            <h4 className="mb-3">Resumen de Facturación</h4>
            <MDBTable bordered className="mb-4">
              <MDBTableBody>
                {/* Encapsulamos todo el contenido en elementos JSX para evitar texto suelto */}
                <tr>
                  <th scope="row">Subtotal</th>
                  <td className="text-end">
                    {factura.subtotal ? `$${parseFloat(factura.subtotal).toFixed(2)}` : '$0.00'}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Impuestos ({factura.impuestos || '0%'})</th>
                  <td className="text-end">
                    {factura.iva ? `$${parseFloat(factura.iva).toFixed(2)}` : '$0.00'}
                  </td>
                </tr>
                {/* Renderizado condicional del descuento */}
                {(factura.porcentaje_descuento && parseFloat(factura.porcentaje_descuento) > 0) ? (
                  <tr>
                    <th scope="row"><FaPercentage className="me-2" />Descuento ({factura.porcentaje_descuento}%)</th>
                    <td className="text-end">
                      {factura.subtotal && factura.porcentaje_descuento ? `-$${(parseFloat(factura.subtotal) * (parseFloat(factura.porcentaje_descuento) / 100)).toFixed(2)}` : '$0.00'}
                    </td>
                  </tr>
                ) : null}
                <tr className="fw-bold">
                  <th scope="row"><FaDollarSign className="me-2" />Total</th>
                  <td className="text-end">
                    {factura.valor_total ? `$${parseFloat(factura.valor_total).toFixed(2)}` : '$0.00'}
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </div>
        ) : (
          <p className="text-center">No se encontraron detalles para esta factura</p>
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

export default FacturaDetalleModal;