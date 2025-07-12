import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import TorneoService from "@services/TorneoService"; // Services
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
import useHasPermission from "@hooks/useHasPermission";

const TorneosList = () => {
  const { data: torneos, loading, error, reload: cargarTorneos } = useFetchData(TorneoService.torneos);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [torneoVer, setTorneoVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(torneos, "nombre_torneo");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsTorneo = [
    { key: "nombre_torneo", label: "Nombre" }
  ];
  const confirmModal = useModalConfirm();

  const camposTorneo = [
    { nombre: "nombre_torneo", label: "Nombre", tipo: "text" }
  ];

  const handleEditar = (torneo) => {
    setModoEdicion(true);
    setTorneoSeleccionado(torneo);
    setModalShow(true);
  };

  const handleVer = (torneo) => {
    setTorneoVer(torneo);
    setModalVer(true);
  };

  const guardarOActualizarTorneo = async (datosForm) => {
    const esEdicion = modoEdicion;
    const datosTransformados = {
      ...datosForm,
      nombre: datosForm.nombre_torneo,
    };
    delete datosTransformados.nombre_torneo;
    try {
      setGuardando(true);
      esEdicion ? await TorneoService.upTorneo(datosTransformados) : await TorneoService.crTorneo(datosTransformados);
      sessionStorage.removeItem("torneos");
      await cargarTorneos();
      setErrorGuardar({ message: esEdicion ? "Torneo actualizado correctamente" : "Torneo creado correctamente", variant: "success" });
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 3000);
      setGuardando(false);
      setModoEdicion(false);
    }
  };
  const canCreate = useHasPermission('torneos:Crea');
  const canEdit = useHasPermission('torneos:Actualiza');
  const canView = useHasPermission('torneos:Lee');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!canView) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          No tienes permisos para ver los torneos
        </div>
      </Container>
    );
  }

  return (

    <Container className="py-4">
      {/* <h2 className="mb-4 text-center fw-bold">Torneos</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Torneos</h2>
        <div className="d-flex align-items-center gap-2">
          {canCreate && (
            <Button
              variant="success"
              onClick={() => {
                setModoEdicion(false);
                setTorneoSeleccionado(null);
                setModalCrearShow(true);
              }}
              className="rounded-circle d-flex justify-content-center align-items-center btn_add"
              style={{ width: "45px", height: "45px" }}
              title="Crear Torneo"
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
        columns={columnsTorneo}
        onEdit={handleEditar}
        onView={handleVer}
        showEdit={canEdit}
        showView={canView}
      />

      {/* Modal para editar */}
      {canEdit && modalShow && torneoSeleccionado && (
        <ModalEditForm
          titulo={"Editar Torneo"}
          show={modalShow}
          onClose={() => setModalShow(false)}
          datos={torneoSeleccionado}
          campos={camposTorneo}
          onSubmit={(nuevosTorneos) => {
            const datosForm = {
              ...torneoSeleccionado,
              ...nuevosTorneos
            };
            guardarOActualizarTorneo(datosForm);
            setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {canView && modalVer && (
        <ModalVerGenerico
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposTorneo}
          datos={torneoVer}
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
        <CreateModalFormulario
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          campos={camposTorneo}
          onSubmit={guardarOActualizarTorneo}
          torneosDisponibles={torneos}
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

export default TorneosList;