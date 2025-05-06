import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import {
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
  MDBProgress,
  MDBProgressBar,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn
} from 'mdb-react-ui-kit';
// Remove unused axios import since it's not being used in the code
import AuthService from '@services/AuthService';
import FacturaService from '@services/FacturaService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFacturas: 0,
    facturasPendientes: 0,
    facturasCompletadas: 0,
    ultimasFacturas: [],
    facturacionMensual: [],
    clientesDestacados: [],
    distribucionEstados: { completadas: 0, pendientes: 0, canceladas: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Datos para el gráfico de barras
  const chartData = stats.facturacionMensual.map(item => ({
    label: item.mes,
    value: item.valor,
    color: '#243E6E'
  }));

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
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h2 className="section-title">
          <MDBIcon fas icon="tachometer-alt" className="me-2" />
          Dashboard
        </h2>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <Row className="mb-4">
        <Col md={4}>
          <MDBCard className="stat-card primary text-white mb-3">
            <MDBCardBody>
              <MDBCardTitle>
                <MDBIcon fas icon="file-invoice" className="dashboard-icon" />
                Total Facturas
              </MDBCardTitle>
              <MDBCardText className="display-4">{stats.totalFacturas}</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </Col>
        
        <Col md={4}>
          <MDBCard className="stat-card warning text-white mb-3">
            <MDBCardBody>
              <MDBCardTitle>
                <MDBIcon fas icon="clock" className="dashboard-icon" />
                Pendientes
              </MDBCardTitle>
              <MDBCardText className="display-4">{stats.facturasPendientes}</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </Col>
        
        <Col md={4}>
          <MDBCard className="stat-card success text-white mb-3">
            <MDBCardBody>
              <MDBCardTitle>
                <MDBIcon fas icon="check-circle" className="dashboard-icon" />
                Completadas
              </MDBCardTitle>
              <MDBCardText className="display-4">{stats.facturasCompletadas}</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </Col>
      </Row>
      
     
      
      {/* Clientes destacados y últimas facturas */}
      <Row>
        <Col lg={4}>
          <div className="widget">
            <h5 className="widget-title">
              <MDBIcon fas icon="users" className="dashboard-icon" />
              Clientes Destacados
            </h5>
            <MDBTable hover>
              <MDBTableHead light>
                <tr>
                  <th>Cliente</th>
                  <th>Facturas</th>
                  <th>Total</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {stats.clientesDestacados.map((cliente, index) => (
                  <tr key={index}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.facturas}</td>
                    <td>${cliente.montoTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
        </Col>
        
        <Col lg={8}>
          <MDBCard className="dashboard-card">
            <MDBCardHeader className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <MDBIcon fas icon="list" className="dashboard-icon" />
                Últimas Facturas
              </h5>
              <MDBBtn color='primary' size='sm' href='/facturas'>
                Ver todas
              </MDBBtn>
            </MDBCardHeader>
            <MDBTable hover>
              <MDBTableHead light>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {stats.ultimasFacturas.map(factura => (
                  <tr key={factura.id}>
                    <td>{factura.numero}</td>
                    <td>{factura.fecha}</td>
                    <td>{factura.cliente}</td>
                    <td>${factura.monto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                      <MDBBadge 
                        color={factura.estado === 'Completada' ? 'success' : 'warning'} 
                        pill 
                        className='px-3 py-2'
                      >
                        {factura.estado}
                      </MDBBadge>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;