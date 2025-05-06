import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBTooltip
} from 'mdb-react-ui-kit';
import { FaSearch, FaPlus, FaEye, FaPencilAlt, FaTrashAlt, FaFileInvoiceDollar, FaCalendarAlt, FaIdCard, FaBuilding, FaDollarSign, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFilePdf, FaMoneyBillWave } from 'react-icons/fa';
import FacturaService from '@services/FacturaService';
import UploadFacturaModal from './UploadFacturaModal';
import FacturaDetalleModal from './FacturaDetalleModal';
import FacturaEditModal from './FacturaEditModal';
import FacturaCausacionModal from './FacturaCausacionModal';
import './Facturas.css';
import FacturaPDFModal from './FacturaPDFModal';

const Facturas = () => {
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [facturas, setFacturas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState(null);
  const [showCausacionModal, setShowCausacionModal] = useState(false);

  const fetchFacturas = async () => {
    setLoading(true);
    setError('');
    try {
      // Obtener facturas usando el servicio
      const facturasData = await FacturaService.getFacturas();
      facturasData && facturasData.length > 0 ? setFacturas(facturasData) : setFacturas([]);
    } catch (err) {
      setError(err.message || 'Error al cargar las facturas');
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchFacturas();
    };
    fetchData();
  }, []);

  // Filtrar facturas con validación para evitar errores con valores undefined
  const facturasFiltradas = facturas.filter(factura => {
    return ['numero', 'nitVendedor', 'razonSocial'].some(campo => {
      const valor = factura[campo];
      return typeof valor === 'string' && valor.toLowerCase().includes(filtro.toLowerCase());
    });
  });

  // Paginación
  const totalPages = Math.ceil(facturasFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = facturasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Gestión de Facturas</h2>

      <Row className="mb-4">
        <Col md={6}>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Buscar por número, NIT o razón social..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </Col>
        <Col md={6} className="text-end">
          <MDBBtn color="primary" onClick={() => setShowUploadModal(true)}>
            <FaPlus className="me-2" />
            Nueva Factura
          </MDBBtn>
        </Col>
      </Row>

      <MDBTable hover responsive className="factura-table">
        <MDBTableHead>
          <tr>
            <th><FaFileInvoiceDollar className="me-2" />Número Factura</th>
            <th><FaCalendarAlt className="me-2" />Fecha</th>
            <th><FaIdCard className="me-2" />Nit Vendedor</th>
            <th><FaBuilding className="me-2" />Razón Social</th>
            <th><FaDollarSign className="me-2" />Total Factura</th>
            <th><FaExclamationTriangle className="me-2" />Estado</th>
            <th>Acciones</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentItems.length > 0 ? (
            currentItems.map(factura => (
              <tr key={factura.id}>
                <td>{factura.numero}</td>
                <td>{factura.fecha}</td>
                <td>{factura.nitVendedor}</td>
                <td>{factura.razonSocialVendedor}</td>
                <td>${factura.monto.toFixed(2)}</td>
                <td>
                  <MDBBadge
                    color={
                      factura.estado === 'Completada' ? 'success' :
                        factura.estado === 'Anulada' ? 'danger' : 'warning'
                    }
                    pill
                    className={`badge-${factura.estado.toLowerCase()}`}
                  >
                    {factura.estado === 'Completada' ? <FaCheckCircle className="me-1" /> :
                      factura.estado === 'Anulada' ? <FaTimesCircle className="me-1" /> :
                        <FaExclamationTriangle className="me-1" />}
                    {factura.estado}
                  </MDBBadge>
                </td>
                <td className="factura-actions">
                  <MDBTooltip tag="span" title="Ver detalles">
                    <MDBBtn
                      color="info"
                      size="sm"
                      onClick={() => {
                        setSelectedFacturaId(factura.id);
                        setShowDetalleModal(true);
                      }}
                    >
                      <FaEye />
                    </MDBBtn>
                  </MDBTooltip>
                  <MDBTooltip tag="span" title="Ver PDF">
                    <MDBBtn
                      color="primary"
                      size="sm"
                      onClick={() => {
                        try {
                          setSelectedFacturaId(factura.factura_pdf);
                          setShowPDFModal(true);
                        } catch (error) {
                          console.error('Error al abrir el PDF:', error);
                          alert('No se pudo abrir el PDF de la factura');
                        }
                      }}
                    >
                      <FaFilePdf />
                    </MDBBtn>
                  </MDBTooltip>
                  <MDBTooltip tag="span" title="Editar factura">
                    <MDBBtn
                      color="warning"
                      size="sm"
                      onClick={() => {
                        setSelectedFacturaId(factura.id);
                        setShowEditModal(true);
                      }}
                    >
                      <FaPencilAlt />
                    </MDBBtn>
                  </MDBTooltip>
                  <MDBTooltip tag="span" title="Eliminar factura">
                    <MDBBtn color="danger" size="sm">
                      <FaTrashAlt />
                    </MDBBtn>
                  </MDBTooltip>
                  <MDBTooltip tag="span" title="Causación">
                    <MDBBtn
                      color="info"
                      size="sm"
                      style={{
                        backgroundColor: '#6f42c1',
                        boxShadow: '0 2px 5px rgba(111, 66, 193, 0.5)',
                        border: '1px solid #5e35b1'
                      }}
                      onClick={() => {
                        setSelectedFacturaId(factura.id);
                        setShowCausacionModal(true);
                      }}
                    >
                      <FaMoneyBillWave />
                    </MDBBtn>
                  </MDBTooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No se encontraron facturas
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <MDBPagination>
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                Anterior
              </MDBPaginationLink>
            </MDBPaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <MDBPaginationItem key={page} active={currentPage === page}>
                <MDBPaginationLink onClick={() => handlePageChange(page)}>
                  {page}
                </MDBPaginationLink>
              </MDBPaginationItem>
            ))}

            <MDBPaginationItem disabled={currentPage === totalPages}>
              <MDBPaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                Siguiente
              </MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
        </div>
      )}

      {/* Modal para cargar facturas XML */}
      <UploadFacturaModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onSuccess={() => {
          // Recargar las facturas después de una carga exitosa
          fetchFacturas();
        }}
      />

      {/* Modal para ver detalles de factura */}
      <FacturaDetalleModal
        show={showDetalleModal}
        onHide={() => setShowDetalleModal(false)}
        facturaId={selectedFacturaId}
      />

      {/* Modal para ver PDF de factura */}
      <FacturaPDFModal
        show={showPDFModal}
        onHide={() => setShowPDFModal(false)}
        facturaId={selectedFacturaId}
      />

      {/* Modal para editar factura */}
      <FacturaEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        facturaId={selectedFacturaId}
        onSuccess={() => {
          // Recargar las facturas después de una edición exitosa
          fetchFacturas();
        }}
      />

      {/* Modal para causación de factura */}
      <FacturaCausacionModal
        show={showCausacionModal}
        onHide={() => setShowCausacionModal(false)}
        facturaId={selectedFacturaId}
        onSuccess={() => {
          // Recargar las facturas después de una causación exitosa
          fetchFacturas();
        }}
      />
    </Container>
  );
};

export default Facturas;