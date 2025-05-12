import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';
import ClienteService from '@services/ClienteService';
import ClienteForm from './ClienteForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const fetchClientes = async () => {
    setLoading(true);
    setError('');
    try {
      // Obtener clientes usando el servicio
      const clientesData = await ClienteService.getClientes();
      
      // Si hay datos, actualizar el estado
      if (clientesData && clientesData.length > 0) {
        setClientes(clientesData);
        console.log('Clientes cargados:', clientesData);
      } else {
        // Si no hay datos, mostrar un mensaje
        console.log('No se encontraron clientes en la base de datos');
        setClientes([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar los clientes:', err);
      setError(err.message || 'Error al cargar los clientes');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    // Verificar que los campos existan antes de usar toLowerCase
    const nitMatch = cliente.nit && typeof cliente.nit === 'string' ? 
      cliente.nit.toLowerCase().includes(filtro.toLowerCase()) : false;
    const razonSocialMatch = cliente.razonSocial && typeof cliente.razonSocial === 'string' ? 
      cliente.razonSocial.toLowerCase().includes(filtro.toLowerCase()) : false;
    return nitMatch || razonSocialMatch;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = clientesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);

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

  // Funciones para manejar el formulario de cliente
  const handleOpenForm = (cliente = null) => {
    setCurrentCliente(cliente);
    setIsEditing(!!cliente);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentCliente(null);
    setIsEditing(false);
  };

  // Funciones para manejar el modal de eliminación
  const handleOpenDeleteModal = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setClienteToDelete(null);
  };

  // Función para guardar un cliente (crear o actualizar)
  const handleSaveCliente = async (clienteData) => {
    try {
      if (isEditing && currentCliente) {
        // Actualizar cliente existente
        await ClienteService.updateCliente(currentCliente.id, clienteData);
      } else {
        // Crear nuevo cliente
        await ClienteService.createCliente(clienteData);
      }
      await fetchClientes();
      toast.success(isEditing ? 'Cliente actualizado con éxito' : 'Cliente creado con éxito');
    } catch (err) {
      toast.error('Error al guardar el cliente');
      console.error(err);
    }
  };

  // Función para eliminar un cliente
  const handleDeleteCliente = async () => {
    if (!clienteToDelete) return;
    
    try {
      await ClienteService.deleteCliente(clienteToDelete.id);
      await fetchClientes();
      handleCloseDeleteModal();
      toast.success('Cliente eliminado con éxito');
    } catch (err) {
      toast.error('Error al eliminar el cliente');
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Clientes</h2>
        <Button variant="primary" onClick={() => handleOpenForm()}>
          <MDBIcon fas icon="plus" className="me-2" /> Nuevo Cliente
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por NIT o razón social..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </Col>
      </Row>
      
      <MDBTable hover responsive>
        <MDBTableHead>
          <tr>
            <th>NIT</th>
            <th>Razón Social</th>
            <th>Tipo Tributación</th>
            <th>Acciones</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentItems.length > 0 ? (
            currentItems.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nit}</td>
                <td>{cliente.razonSocial}</td>
                <td>{cliente.tipoTributacion}</td>
                <td>
                  <MDBBtn color="link" size="sm" className="p-0 me-2" onClick={() => handleOpenForm(cliente)}>
                    <MDBIcon fas icon="edit" title="Editar" />
                  </MDBBtn>
                  <MDBBtn color="link" size="sm" className="p-0 text-danger" onClick={() => handleOpenDeleteModal(cliente)}>
                    <MDBIcon fas icon="trash-alt" title="Eliminar" />
                  </MDBBtn>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No se encontraron clientes
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

      {/* Formulario para crear/editar cliente */}
      <ClienteForm 
        show={showForm} 
        handleClose={handleCloseForm} 
        cliente={currentCliente} 
        onSave={handleSaveCliente} 
        isEditing={isEditing} 
      />

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el cliente {clienteToDelete?.razonSocial}?
          <br />
          <strong>Esta acción no se puede deshacer.</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteCliente}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Clientes;