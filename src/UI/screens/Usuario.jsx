import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import UsuarioService from "@services/UsuarioService"; // Services
import RolService from "@services/RolService";
import EstadoService from "@services/EstadoService";
import useSearch from "@hooks/useSearch"; // Hooks
import useFetchData from "@hooks/useFetchData";
import usePagination from "@hooks/usePagination";
import useErrorHandler from "@hooks/useErrorHandler";
import useModalConfirm from "@hooks/useModalConfirm";
import Paginator from "@componentsUseable/Paginator"; // Components
import LoadingSpinner from "@componentsUseable/Loading";
import SearchInput from "@componentsUseable/SearchInput";
import ErrorMessage from "@componentsUseable/ErrorMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import ScrollTopButton from "@componentsUseable/Toggle/ScrollTopButton";
import ViewModalUsuario from "@componentsUseable/Usuarios/ModalVerUsuario";
import EditModalUsuario from "@componentsUseable/Usuarios/ModalEditUsuario";
import CreateModalUsuario from "@componentsUseable/Usuarios/ModalCreateUsuario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css"; // Styles
import useHasPermission from "@hooks/useHasPermission";

const UsuariosList = () => {
  const { data: usuarios, loading, error, reload: cargarUsuarios } = useFetchData(UsuarioService.usuarios);
  const { data: roles } = useFetchData(RolService.roles);
  const { data: estados } = useFetchData(EstadoService.estados);
  
  const { handleError } = useErrorHandler();
  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioVer, setUsuarioVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(usuarios, "nom_user");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsUsuario = [
    { key: "documento", label: "Documento" },
    { key: "nombres", label: "Nombre" },
    {
      key: "estado",
      label: "Estado",
      render: (estado) => (
        <MDBIcon
          fas
          icon={estado ? "check-circle" : "times-circle"}
          className={estado ? "text-success" : "text-danger"}
          title={estado ? "Activo" : "Inactivo"}
        />
      )
    }
  ];
  const confirmModal = useModalConfirm();
  const camposUsuario = [
    { nombre: "nombres", label: "Nombres", tipo: "text" },
    { nombre: "apellido", label: "Apellidos", tipo: "text" },
    { nombre: "nom_user", label: "Nombre de usuario", tipo: "text" },
    { nombre: "fecha_nacimiento", label: "Fecha de nacimiento", tipo: "date" },
    { nombre: "documento", label: "Documento", tipo: "text" },
    { nombre: "email", label: "Correo", tipo: "email" },
    { nombre: "num_contacto", label: "Numero de contacto", tipo: "text" },
    { nombre: "info_perfil", label: "Informacion personal", tipo: "textarea" },
    { nombre: "rol", label: "Rol", tipo: "text" },
    { nombre: "estado", label: "Estado", tipo: "select", options: [{ value: true, label: "Activo" }, { value: false, label: "Inactivo" }] },
  ];

  const handleEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario);
    setModalShow(true);
  };

  const handleVer = (usuario) => {
    setUsuarioVer(usuario);
    setModalVer(true);
  };

  const guardarOActualizarUsuario = async (datosForm) => {
    const esEdicion = modoEdicion;
    const datosTransformados = {
      ...datosForm,
      nombre: datosForm.nombre_usuario,
    };
    delete datosTransformados.nombre_usuario;
    try {
      setGuardando(true);
      esEdicion ? await UsuarioService.upUsuario(datosTransformados) : await UsuarioService.crUsuario(datosTransformados);
      sessionStorage.removeItem("usuarios");
      await cargarUsuarios();
      setErrorGuardar({ message: esEdicion ? "Usuario actualizado correctamente" : "Usuario creado correctamente", variant: "success" });
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 3000);
      setGuardando(false);
      setModoEdicion(false);
    }
  };
  const canCreate = useHasPermission('usuarios:Crea');
  const canEdit = useHasPermission('usuarios:Actualiza');
  const canView = useHasPermission('usuarios:Lee');
  

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!canView) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          No tienes permisos para ver los usuarios
        </div>
      </Container>
    );
  }


  return (

    <Container className="py-4">
      {/* <h2 className="mb-4 text-center fw-bold">Usuarios</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Usuarios</h2>
        <div className="d-flex align-items-center gap-2">
          {canCreate && (
            <Button
              variant="success"
              onClick={() => {
                setModoEdicion(false);
                setUsuarioSeleccionado(null);
                setModalCrearShow(true);
              }}
              className="rounded-circle d-flex justify-content-center align-items-center btn_add"
              style={{ width: "45px", height: "45px" }}
              title="Crear Usuario"
            >
              <MDBIcon fas icon="plus" />
            </Button>
          )}
          {canView && (<SearchInput value={query} onChange={setQuery} />)}
        </div>
      </div>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <TableGeneric
        data={paginatedData}
        columns={columnsUsuario}
        onEdit={handleEditar}
        onView={handleVer}
        showEdit={canEdit}
        showView={canView}
      />

      {/* Modal para editar */}
      {canEdit && modalShow && usuarioSeleccionado && (
        <EditModalUsuario
          titulo={"Editar Usuario"}
          show={modalShow}
          onClose={() => setModalShow(false)}
          datos={usuarioSeleccionado}
          campos={camposUsuario}
          onSubmit={(nuevosUsuarios) => {
            const datosForm = {
              ...usuarioSeleccionado,
              ...nuevosUsuarios
            };
            guardarOActualizarUsuario(datosForm);
            setModalShow(false);
          }}
          roles={roles}
          estados={estados}
        />
      )}

      {/* Modal para ver */}
      {canView && modalVer && (
        <ViewModalUsuario
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposUsuario}
          usuario={usuarioVer}
        />
      )}

      {canEdit && (
        <ModalConfirmacion
          show={confirmModal.show}
          mensaje={confirmModal.mensaje}
          onConfirm={confirmModal.onConfirm}
          onClose={confirmModal.close}
        />
      )}

      {canCreate && modalCrearShow && (
        <CreateModalUsuario
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          campos={camposUsuario}
          onSubmit={guardarOActualizarUsuario}
          roles={roles}
          estados={estados}
        />
      )}

      {canView && shouldShowPaginator && (
        <Paginator
          currentPage={currentPage}
          maxPage={maxPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
      <ScrollTopButton />
    </Container>
  );
};

export default UsuariosList;