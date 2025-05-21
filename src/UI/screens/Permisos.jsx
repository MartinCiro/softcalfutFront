import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import PermisoService from "@services/PermisoService"; // Services
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
import PermisoVer from "@componentsUseable/permisos/PermisoVer";
import PermisoEditor from "@src/UI/useable-components/permisos/PermisoEditor";
import PermisoCreador from "@componentsUseable/permisos/PermisoCreador";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css"; // Styles

const PermisosList = () => {
  const { data: permisos, loading, error, reload: cargarPermisos } = useFetchData(PermisoService.permisos);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const [permisoVer, setPermisoVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(permisos, "entidad");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsPermiso = [
    { key: "entidad", label: "Nombre" },
    { key: "descripcion", label: "Descripción" }
  ];
  const confirmModal = useModalConfirm();

  const camposPermiso = [
    { nombre: "entidad", label: "Nombre", tipo: "text", bloqueado: true },
    { nombre: "descripcion", label: "Descripción", tipo: "text" }
  ];

  const handleEditar = (permiso) => {
    const permisosSeleccionados = {
      [permiso.entidad]: permiso.permisos || []
    };
    setPermisoSeleccionado({
      ...permiso,
      permisosSeleccionados
    });
    setModoEdicion(true);
    setModalShow(true);
  };


  const handleToggleActivo = (permiso) => {
    const nuevoEstado = permiso.estado === "Activo" ? "Inactivo" : "Activo";
    const accion = nuevoEstado === "Activo" ? "activar" : "desactivar";
    const mensaje = `¿Deseas ${accion} el permiso "${permiso.titulo}"?`;

    confirmModal.open(mensaje, async () => {
      try {
        await PermisoService.upPermiso(permiso.id, { estado: nuevoEstado });
        sessionStorage.removeItem("permisos");
        await cargarPermisos();
      } catch (err) {
        handleError(err);
      }
    });
  };

  const handleVer = (permiso) => {
    setPermisoVer(permiso);
    setModalVer(true);
  };

  const guardarOActualizarPermiso = async (datosForm) => {
    const esEdicion = modoEdicion;
    try {
      setGuardando(true);
      esEdicion ? await PermisoService.upPermiso(datosForm.permisos) : await PermisoService.crPermiso(datosForm);
      sessionStorage.removeItem("permisos");
      await cargarPermisos();
      setErrorGuardar({ message: esEdicion ? "Permiso actualizado correctamente" : "Permiso creado correctamente", variant: "success" });
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
      {/* <h2 className="mb-4 text-center fw-bold">Permisos</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Permisos</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              setModoEdicion(false);
              setPermisoSeleccionado(null);
              setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "45px", height: "45px" }}
            title="Crear Permiso"
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
        columns={columnsPermiso}
        onEdit={handleEditar}
        onView={handleVer}
        handleToggleActivo={handleToggleActivo}
      />

      {/* Modal para editar */}
      {modalShow && permisoSeleccionado && (
        <PermisoEditor
          show={modalShow}
          onClose={() => setModalShow(false)}
          permisosSeleccionado={permisoSeleccionado}
          camposPermiso={camposPermiso}
          onGuardar={(nuevosPermisos) => {
            const datosForm = {
              ...permisoSeleccionado,
              permisos: nuevosPermisos
            };
            guardarOActualizarPermiso(datosForm);
            setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <PermisoVer
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposPermiso}
          datos={permisoVer}
        />
      )}

      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />

      {modalCrearShow && (
        <PermisoCreador
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          campos={camposPermiso}
          onSubmit={guardarOActualizarPermiso}
          permisosDisponibles={permisos}
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

export default PermisosList;