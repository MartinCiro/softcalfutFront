import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import UsuarioService from "@services/UsuarioService"; // Services
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
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css"; // Styles

const UsuariosList = () => {
  const { data: usuarios, loading, error, reload: cargarUsuarios } = useFetchData(UsuarioService.usuarios);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioVer, setUsuarioVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(usuarios, "nombre_usuario");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsUsuario = [
    { key: "nombre_usuario", label: "Nombre" }
  ];
  const confirmModal = useModalConfirm();

  const camposUsuario = [
    { nombre: "nombre_usuario", label: "Nombre", tipo: "text" }
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (

    <Container className="py-4">
      {/* <h2 className="mb-4 text-center fw-bold">Usuarios</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Usuarios</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              setModoEdicion(false);
              setUsuarioSeleccionado(null);
              setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "45px", height: "45px" }}
            title="Crear Usuario"
          >
            <MDBIcon fas icon="plus" />
          </Button>
          <SearchInput value={query} onChange={setQuery} />
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
      />

      {/* Modal para editar */}
      {modalShow && usuarioSeleccionado && (
        <ModalEditForm
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
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <ModalVerGenerico
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposUsuario}
          datos={usuarioVer}
        />
      )}

      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />

      {modalCrearShow && (
        <CreateModalFormulario
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          campos={camposUsuario}
          onSubmit={guardarOActualizarUsuario}
          usuariosDisponibles={usuarios}
          guardando={guardando}
        />
      )}

      {shouldShowPaginator && (
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