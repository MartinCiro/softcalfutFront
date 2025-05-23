import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import EstadoService from "@services/EstadoService"; // Services
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

const EstadosList = () => {
  const { data: estados, loading, error, reload: cargarEstados } = useFetchData(EstadoService.estados);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [estadoVer, setEstadoVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(estados, "nombre");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsEstado = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" }
  ];
  const confirmModal = useModalConfirm();

  const camposEstado = [
    { nombre: "nombre", label: "Nombre", tipo: "text" },
    { nombre: "descripcion", label: "Descripción", tipo: "text" }
  ];

  const handleEditar = (estado) => {
    setModoEdicion(true);
    setEstadoSeleccionado(estado);
    setModalShow(true);
  };

  const handleVer = (estado) => {
    setEstadoVer(estado);
    setModalVer(true);
  };

  const guardarOActualizarEstado = async (datosForm) => {
    const esEdicion = modoEdicion;
    try {
      setGuardando(true);
      esEdicion ? await EstadoService.upEstado(datosForm) : await EstadoService.crEstado(datosForm);
      sessionStorage.removeItem("estados");
      await cargarEstados();
      setErrorGuardar({ message: esEdicion ? "Estado actualizado correctamente" : "Estado creado correctamente", variant: "success" });
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Estados</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              setModoEdicion(false);
              setEstadoSeleccionado(null);
              setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "45px", height: "45px" }}
            title="Crear Estado"
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
        columns={columnsEstado}
        onEdit={handleEditar}
        onView={handleVer}
      />

      {/* Modal para editar */}
      {modalShow && estadoSeleccionado && (
        <ModalEditForm
          titulo={"Editar Estado"}
          show={modalShow}
          onClose={() => setModalShow(false)}
          datos={estadoSeleccionado}
          campos={camposEstado}
          onSubmit={(nuevosEstados) => {
            const datosForm = {
              ...estadoSeleccionado,
              ...nuevosEstados  
            };
            guardarOActualizarEstado(datosForm);
            setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <ModalVerGenerico
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposEstado}
          datos={estadoVer}
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
          campos={camposEstado}
          onSubmit={guardarOActualizarEstado}
          estadosDisponibles={estados}
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

export default EstadosList;