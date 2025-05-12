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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Usuarios.css';
import UsuarioService from '@services/UsuarioService';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [roles, setRoles] = useState([]);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');

  // Datos de ejemplo para desarrollo
  const usuariosEjemplo = [
    { id: 1, nombre: 'Admin', correo: 'admin@example.com', rol: 'Administrador', activo: true },
    { id: 2, nombre: 'Usuario', correo: 'usuario@example.com', rol: 'Usuario', activo: true },
    { id: 3, nombre: 'Invitado', correo: 'invitado@example.com', rol: 'Invitado', activo: false },
  ];

  const rolesEjemplo = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Usuario' },
    { id: 3, nombre: 'Invitado' },
  ];

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      // Llamada al servicio real
      const response = await UsuarioService.getUsuarios();
      if (response && response.length > 0) {
        // Asegurarse de que cada usuario tenga un ID
        const usuariosConIds = response.map((usuario, index) => {
          if (!usuario.id) {
            return { ...usuario, id: `temp-id-${index}` };
          }
          return usuario;
        });
        setUsuarios(usuariosConIds);
      } else {
        // Si no hay datos, usar datos de ejemplo en desarrollo
        console.log('No se encontraron usuarios en la base de datos');
        // Asegurarse de que los datos de ejemplo tengan IDs únicos
        setUsuarios(usuariosEjemplo);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      // Por ahora usamos datos de ejemplo para los roles
      // En el futuro se implementará un servicio para roles
      setRoles(rolesEjemplo);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      toast.error(`Error al cargar los roles: ${err.message || 'Error desconocido'}`);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    // Verificar que los campos existan antes de usar toLowerCase
    const nombreMatch = usuario.nombre && typeof usuario.nombre === 'string' ? 
      usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) : false;
    const correoMatch = usuario.correo && typeof usuario.correo === 'string' ? 
      usuario.correo.toLowerCase().includes(filtro.toLowerCase()) : false;
    const rolMatch = usuario.rol && typeof usuario.rol === 'string' ? 
      usuario.rol.toLowerCase().includes(filtro.toLowerCase()) : false;
    return nombreMatch || correoMatch || rolMatch;
  });
  
  // Asegurarse de que cada usuario tenga un ID único
  const usuariosConId = usuariosFiltrados.map((usuario, index) => {
    if (!usuario.id) {
      return { ...usuario, id: `temp-id-${index}` };
    }
    return usuario;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usuariosConId.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuariosConId.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Funciones para manejar el formulario de usuario
  const handleOpenForm = (usuario = null) => {
    setCurrentUsuario(usuario);
    setIsEditing(!!usuario);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentUsuario(null);
    setIsEditing(false);
    setValidated(false);
    setFormError('');
  };

  // Funciones para manejar el modal de eliminación
  const handleOpenDeleteModal = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUsuarioToDelete(null);
  };

  // Función para guardar un usuario (crear o actualizar)
  const handleSaveUsuario = async (e) => {
    e.preventDefault();
    // Obtener referencia al formulario de manera más segura
    const form = document.getElementById('usuarioForm');
    
    // Limpiar errores anteriores
    setFormError('');
    
    // Validar el formulario
    if (form && form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.warning('Por favor complete todos los campos requeridos correctamente');
      return;
    }
    
    // Mostrar indicador de carga
    setLoading(true);
    
    try {
      // Recopilar datos del formulario
      const formElements = form.elements;
      const usuarioData = {
        nombre: formElements.nombre.value,
        correo: formElements.correo.value,
        rol: formElements.rol.value,
        activo: formElements.activo.checked
      };
      
      // Añadir contraseña solo si es un nuevo usuario o si se ha modificado
      if (!isEditing && formElements.password.value) {
        usuarioData.password = formElements.password.value;
      } else if (isEditing && formElements.password && formElements.password.value) {
        usuarioData.password = formElements.password.value;
      }
      
      // Registrar información para depuración
      console.log(`Intentando ${isEditing ? 'actualizar' : 'crear'} usuario:`, {
        id: isEditing ? currentUsuario.id : 'nuevo',
        nombre: usuarioData.nombre,
        correo: usuarioData.correo,
        rol: usuarioData.rol,
        activo: usuarioData.activo,
        tienePassword: !!usuarioData.password
      });
      
      let resultado;
      // Llamada al servicio real
      if (isEditing && currentUsuario) {
        resultado = await UsuarioService.updateUsuario(currentUsuario.id, usuarioData);
        console.log('Usuario actualizado exitosamente:', currentUsuario.id);
      } else {
        resultado = await UsuarioService.createUsuario(usuarioData);
        console.log('Usuario creado exitosamente:', usuarioData.nombre);
      }
      
      // Actualizar la lista de usuarios solo si la operación fue exitosa
      if (resultado) {
        await fetchUsuarios();
        handleCloseForm();
        toast.success(isEditing ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito');
      } else {
        // Si no hay resultado pero tampoco hubo error, mostrar advertencia
        console.warn('La operación no retornó un resultado pero tampoco generó un error');
        toast.warning('La operación se completó pero no se pudo confirmar el resultado');
        // Desactivar indicador de carga si no cerramos el formulario
        setLoading(false);
      }
    } catch (err) {
      // Mostrar mensaje de error detallado
      const errorMsg = err.message || 'Error desconocido';
      toast.error(`Error al guardar el usuario: ${errorMsg}`);
      console.error('Error en handleSaveUsuario:', err);
      
      // Establecer el mensaje de error en el formulario
      setFormError(errorMsg);
      
      // Mantener el formulario abierto para que el usuario pueda corregir los datos
      setValidated(true);
      // Desactivar indicador de carga
      setLoading(false);
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUsuario = async () => {
    if (!usuarioToDelete) return;
    
    // Mostrar indicador de carga
    setLoading(true);
    
    try {
      // Llamada al servicio real
      if (usuarioToDelete && usuarioToDelete.id) {
        // Verificar si el ID es temporal (creado localmente)
        if (typeof usuarioToDelete.id === 'string' && usuarioToDelete.id.startsWith('temp-id-')) {
          // Para usuarios con ID temporal, simplemente actualizamos el estado local
          const nuevosUsuarios = usuarios.filter(u => u.id !== usuarioToDelete.id);
          setUsuarios(nuevosUsuarios);
        } else {
          // Para usuarios con ID real, llamamos al servicio de eliminación
          console.log('Intentando eliminar usuario:', usuarioToDelete.id);
          await UsuarioService.deleteUsuario(usuarioToDelete.id);
          console.log('Usuario eliminado exitosamente:', usuarioToDelete.id);
          await fetchUsuarios();
        }
      }
      
      handleCloseDeleteModal();
      toast.success('Usuario eliminado con éxito');
    } catch (err) {
      const errorMsg = err.message || 'Error desconocido';
      toast.error(`Error al eliminar el usuario: ${errorMsg}`);
      console.error('Error en handleDeleteUsuario:', err, {
        usuarioId: usuarioToDelete?.id,
        usuarioNombre: usuarioToDelete?.nombre
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado activo/inactivo de un usuario
  const handleToggleActivo = async (usuario) => {
    try {
      // Actualizar el estado local para reflejar el cambio inmediatamente
      const usuariosActualizados = usuarios.map(u => 
        u.id === usuario.id ? {...u, activo: !u.activo} : u
      );
      setUsuarios(usuariosActualizados);
      
      // Llamada al servicio real
      if (usuario && usuario.id) {
        // Verificar si el ID es temporal (creado localmente)
        if (!(typeof usuario.id === 'string' && usuario.id.startsWith('temp-id-'))) {
          await UsuarioService.updateUsuario(usuario.id, { activo: !usuario.activo });
          console.log('Estado de usuario cambiado:', usuario.id, { activo: !usuario.activo });
        }
      }
      
      toast.success(`Usuario ${usuario.activo ? 'desactivado' : 'activado'} con éxito`);
    } catch (err) {
      // Revertir el cambio en caso de error
      const usuariosRevertidos = usuarios.map(u => 
        u.id === usuario.id ? {...u, activo: usuario.activo} : u
      );
      setUsuarios(usuariosRevertidos);
      
      toast.error(`Error al cambiar el estado del usuario: ${err.message || 'Error desconocido'}`);
      console.error('Error en handleToggleActivo:', err);
    }
  };

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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Administración de Usuarios</h2>
          <p className="text-muted">Gestione usuarios con operaciones completas: Crear, Ver, Actualizar y Eliminar</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => handleOpenForm()}>
          <MDBIcon fas icon="plus" className="me-2" /> Nuevo Usuario
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={6}>
          <div className="search-container">
            <MDBIcon fas icon="search" className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, correo o rol..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </Col>
      </Row>
      
      <MDBTable hover responsive className="usuario-table">
        <MDBTableHead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentItems.length > 0 ? (
            currentItems.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>
                  <span className={`badge ${usuario.activo ? 'bg-success' : 'bg-danger'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="usuario-actions">
                  <MDBBtn color="info" size="sm" className="me-2" onClick={() => handleOpenForm(usuario)}>
                    <MDBIcon fas icon="edit" className="me-1" /> Editar
                  </MDBBtn>
                  <MDBBtn color={usuario.activo ? "success" : "warning"} size="sm" className="me-2" onClick={() => handleToggleActivo(usuario)}>
                    <MDBIcon fas icon={usuario.activo ? 'toggle-on' : 'toggle-off'} className="me-1" /> {usuario.activo ? 'Desactivar' : 'Activar'}
                  </MDBBtn>
                  <MDBBtn color="danger" size="sm" onClick={() => handleOpenDeleteModal(usuario)}>
                    <MDBIcon fas icon="trash-alt" className="me-1" /> Eliminar
                  </MDBBtn>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
      
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 pagination-container">
          <MDBPagination>
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                Anterior
              </MDBPaginationLink>
            </MDBPaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <MDBPaginationItem key={`page-${page}`} active={currentPage === page}>
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

      {/* Modal de formulario para crear/editar usuario */}
      <Modal show={showForm} onHide={handleCloseForm} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger mb-3">{formError}</div>}
          <Form id="usuarioForm" noValidate validated={validated}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Ingrese el nombre"
                defaultValue={currentUsuario?.nombre || ''}
                required
              />
              <Form.Control.Feedback type="invalid">
                El nombre es requerido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                placeholder="Ingrese el correo electrónico"
                defaultValue={currentUsuario?.correo || ''}
                required
              />
              <Form.Control.Feedback type="invalid">
                Ingrese un correo electrónico válido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={isEditing ? "Dejar en blanco para mantener la actual" : "Ingrese la contraseña"}
                required={!isEditing}
              />
              <Form.Control.Feedback type="invalid">
                {isEditing ? "" : "La contraseña es requerida"}
              </Form.Control.Feedback>
              {isEditing && (
                <Form.Text className="text-muted">
                  Deje este campo en blanco si no desea cambiar la contraseña.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" defaultValue={currentUsuario?.rol || ''} required>
                <option value="">Seleccione un rol</option>
                {roles.map(rol => (
                  <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione un rol
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="usuario-activo"
                name="activo"
                label="Usuario activo"
                defaultChecked={currentUsuario ? currentUsuario.activo : true}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveUsuario} disabled={loading}>
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

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el usuario {usuarioToDelete?.nombre}?
          <br />
          <strong>Esta acción no se puede deshacer.</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUsuario} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Usuarios;