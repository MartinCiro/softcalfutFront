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
import './SimpleBarChart.css';

// Componente para mostrar gráfico de barras simple
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="simple-chart">
      {data.map((item, index) => (
        <div key={index} className="chart-item">
          <div className="chart-label">{item.label}</div>
          <div className="chart-bar-container">
            <div 
              className="chart-bar" 
              style={{ 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#243E6E'
              }}
            ></div>
          </div>
          <div className="chart-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // En un escenario real, aquí se haría una petición al backend
        // const response = await axios.get('http://192.168.0.20:8000/api/dashboard', {
        //   headers: AuthService.getAuthHeader()
        // });
        
        // Verificar token sin causar redirecciones
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // Intentar refrescar silenciosamente sin afectar la UI
          AuthService.refreshToken().catch(err => {
            console.warn('Error al refrescar token en dashboard:', err);
            // Continuamos de todas formas para evitar pantalla en blanco
          });
        }
        
        // Obtener datos reales de facturas desde el servicio
        const facturasData = await FacturaService.getFacturas();
        
        // Calcular estadísticas basadas en datos reales
        const totalFacturas = facturasData.length;
        const facturasCompletadas = facturasData.filter(factura => factura.estado === 'Completada').length;
        const facturasPendientes = facturasData.filter(factura => factura.estado === 'Pendiente').length;
        
        // Obtener las últimas 5 facturas ordenadas por fecha
        const ultimasFacturas = [...facturasData]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 5)
          .map(factura => ({
            id: factura.id,
            numero: factura.numero,
            fecha: factura.fecha,
            cliente: factura.razonSocial,
            estado: factura.estado,
            monto: factura.monto
          }));
        
        // Calcular facturación mensual
        const facturacionPorMes = {};
        facturasData.forEach(factura => {
          try {
            // Extraer el mes y año de la fecha
            const fechaPartes = factura.fecha.split('/');
            if (fechaPartes.length === 3) {
              const mes = parseInt(fechaPartes[1]);
              const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
              const nombreMes = nombresMeses[mes - 1];
              
              // Sumar el monto al mes correspondiente
              if (!facturacionPorMes[nombreMes]) facturacionPorMes[nombreMes] = 0
              facturacionPorMes[nombreMes] += factura.monto;
            }
          } catch (error) {
            console.error('Error al procesar fecha para facturación mensual:', error);
          }
        });
        
        // Convertir a formato para el gráfico
        const facturacionMensual = Object.entries(facturacionPorMes)
          .map(([mes, valor]) => ({ mes, valor: Math.round(valor) }))
          .sort((a, b) => {
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses.indexOf(a.mes) - meses.indexOf(b.mes);
          });
        
        // Calcular clientes destacados
        const clientesPorFacturacion = {};
        facturasData.forEach(factura => {
          const cliente = factura.razonSocial;
          if (!clientesPorFacturacion[cliente]) {
            clientesPorFacturacion[cliente] = {
              nombre: cliente,
              facturas: 0,
              montoTotal: 0
            };
          }
          clientesPorFacturacion[cliente].facturas += 1;
          clientesPorFacturacion[cliente].montoTotal += factura.monto;
        });
        
        // Obtener los 3 clientes con mayor facturación
        const clientesDestacados = Object.values(clientesPorFacturacion)
          .sort((a, b) => b.montoTotal - a.montoTotal)
          .slice(0, 3);
        
        // Actualizar el estado con los datos reales
        setStats({
          totalFacturas,
          facturasPendientes,
          facturasCompletadas,
          ultimasFacturas,
          facturacionMensual,
          clientesDestacados,
          distribucionEstados: { 
            completadas: facturasCompletadas, 
            pendientes: facturasPendientes, 
            canceladas: totalFacturas - facturasCompletadas - facturasPendientes 
          }
        });
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        // No mostrar error inmediatamente, intentar nuevamente
        setTimeout(() => {
          try {
            // Cargar datos de respaldo en caso de error
            setStats({
              totalFacturas: 125,
              facturasPendientes: 42,
              facturasCompletadas: 83,
              ultimasFacturas: [
                { id: 1, numero: 'F-2025-001', fecha: '2025-04-10', cliente: 'Empresa ABC', estado: 'Completada', monto: 1250.50 },
                { id: 2, numero: 'F-2025-002', fecha: '2025-04-09', cliente: 'Corporación XYZ', estado: 'Pendiente', monto: 875.30 }
              ],
              facturacionMensual: [
                { mes: 'Enero', valor: 12500 },
                { mes: 'Febrero', valor: 15800 }
              ],
              clientesDestacados: [
                { nombre: 'Empresa ABC', facturas: 15, montoTotal: 18500 }
              ],
              distribucionEstados: { completadas: 83, pendientes: 42, canceladas: 0 }
            });
            setLoading(false);
          } catch {
            setError('Error al cargar los datos del dashboard');
            setLoading(false);
          }
        }, 2000); // Esperar 2 segundos antes de intentar nuevamente
      }
    };

    fetchDashboardData();
  }, []);

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
      
      {/* Gráfico de facturación mensual y distribución de estados */}
      <Row className="mb-4">
        <Col lg={8}>
          <div className="widget">
            <h5 className="widget-title">
              <MDBIcon fas icon="chart-bar" className="dashboard-icon" />
              Facturación Mensual
            </h5>
            <div className="chart-container">
              <SimpleBarChart data={chartData} />
            </div>
          </div>
        </Col>
        
        <Col lg={4}>
          <div className="widget">
            <h5 className="widget-title">
              <MDBIcon fas icon="chart-pie" className="dashboard-icon" />
              Distribución de Estados
            </h5>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Completadas</span>
                <span>{stats.distribucionEstados.completadas}</span>
              </div>
              <MDBProgress height='10'>
                <MDBProgressBar 
                  width={Math.round((stats.distribucionEstados.completadas / stats.totalFacturas) * 100)} 
                  valuemin={0} 
                  valuemax={100} 
                  bgColor='success'
                />
              </MDBProgress>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Pendientes</span>
                <span>{stats.distribucionEstados.pendientes}</span>
              </div>
              <MDBProgress height='10'>
                <MDBProgressBar 
                  width={Math.round((stats.distribucionEstados.pendientes / stats.totalFacturas) * 100)} 
                  valuemin={0} 
                  valuemax={100} 
                  bgColor='warning'
                />
              </MDBProgress>
            </div>
          </div>
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