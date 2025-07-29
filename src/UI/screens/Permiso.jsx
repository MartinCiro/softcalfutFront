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
import PermisoVer from "@componentsUseable/Permisos/PermisoVer";
import PermisoEditor from "@componentsUseable/Permisos/PermisoEditor";
import PermisoCreador from "@componentsUseable/Permisos/PermisoCreador";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css"; // Styles
import useHasPermission from "@hooks/useHasPermission";

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
  const { query, setQuery, filtered } = useSearch(permisos, ["entidad"]);
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
  const canCreate = useHasPermission('permisos:Crea');
  const canEdit = useHasPermission('permisos:Actualiza');
  const canView = useHasPermission('permisos:Lee');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!canView) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          No tienes permisos para ver los permisos
        </div>
      </Container>
    );
  }

  return (

    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Permisos</h2>
        <div className="d-flex align-items-center gap-2">
          {canCreate && (
          <Button
            variant="success"
            onClick={() => {
              setModoEdicion(false);
              setPermisoSeleccionado(null);
              setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center btn_add"
            style={{ width: "45px", height: "45px" }}
            title="Crear Permiso"
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
        columns={columnsPermiso}
        onEdit={handleEditar}
        onView={handleVer}
        showEdit={canEdit}
        showView={canView}
      />

      {/* Modal para editar */}
      {canEdit && modalShow && permisoSeleccionado && (
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
      {canView && modalVer && (
        <PermisoVer
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposPermiso}
          datos={permisoVer}
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
        <PermisoCreador
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          campos={camposPermiso}
          onSubmit={guardarOActualizarPermiso}
          permisosDisponibles={permisos}
          guardando={guardando}
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

export default PermisosList;