import { Container, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import ProgramacionService from "@services/ProgramacionService"; // Services
import useSearch from "@hooks/useSearch"; // Hooks
import useFetchData from "@hooks/useFetchData";
import usePagination from "@hooks/usePagination";
import useModalConfirm from "@hooks/useModalConfirm";
import Paginator from "@componentsUseable/Paginator"; // Components
import LoadingSpinner from "@componentsUseable/Loading";
import SearchInput from "@componentsUseable/SearchInput";
import ErrorMessage from "@componentsUseable/ErrorMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import ScrollTopButton from "@componentsUseable/Toggle/ScrollTopButton";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditGenerico from "@componentsUseable/FormModal/EditModalFormulario";
import ModalCreateGenerico from "@componentsUseable/FormModal/CreateModalFormulario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import Calendar from "@componentsUseable/Programacion/Calendar";

import { useProgramacionLogic } from "@hooks/programacion/useProgramacionLogic";
import { columnsProgramacion, camposProgramacion } from "@constants/programacionConfig";
import "@styles/Permiso.css"; // Styles

const ProgramacionList = () => {
  const { data: programacion, loading, error, reload: cargarProgramacion } = useFetchData(ProgramacionService.programacion);
  const { modalStates, programacionStates, flags, errorGuardar, handlers } = useProgramacionLogic(cargarProgramacion);

  const { query, setQuery, filtered } = useSearch(programacion, "fecha");
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);

  const confirmModal = useModalConfirm();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const handleEditEvento = (eventoEditado) => {
    // Buscar competencia y evento original
    const competencia = programacion.find(c =>
      c.eventos.some(e =>
        `${c.categoria}-${e.local}-${e.visitante}` === eventoEditado.id
      )
    );

    if (!competencia) return;

    const eventoOriginal = competencia.eventos.find(e =>
      `${competencia.categoria}-${e.local}-${e.visitante}` === eventoEditado.id
    );

    const eventoCompleto = {
      ...eventoOriginal,
      ...eventoEditado,
      categoria: competencia.categoria
    };

    // Setear evento en estado y abrir modal
    programacionStates.setProgramacionSeleccionado(eventoCompleto);
    flags.setModoEdicion(true);
    modalStates.setModalShow(true);
  };



  return (

    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold mb-2 mb-md-0 text-center text-md-start text-truncate w-100" style={{ maxWidth: '100%' }}>
          Programacion
        </h2>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              flags.setModoEdicion(false);
              programacionStates.setProgramacionSeleccionado(null);
              modalStates.setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center btn_add"
            style={{ width: "45px", height: "45px" }}
            title="Crear Programacion"
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


      <Calendar data={programacion} onEditEvento={handleEditEvento} />

      {/* Modal para editar */}
      {modalStates.modalShow && programacionStates.programacionSeleccionado && (
        <ModalEditGenerico
          titulo={"Editar Programacion"}
          show={modalStates.modalShow}
          onClose={() => modalStates.setModalShow(false)}
          datos={programacionStates.programacionSeleccionado}
          campos={camposProgramacion}
          onSubmit={(nuevosProgramacion) => {
            const datosForm = {
              ...programacionStates.programacionSeleccionado,
              ...nuevosProgramacion
            };
            handlers.guardarOActualizarProgramacion(datosForm);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalStates.modalVer && (
        <ModalVerGenerico
          show={modalStates.modalVer}
          onClose={() => modalStates.setModalVer(false)}
          campos={camposProgramacion}
          datos={programacionStates.programacionVer}
          titulo={"Detalles del programacion"}
        />
      )}

      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />

      {modalStates.modalCrearShow && (
        <ModalCreateGenerico
          show={modalStates.modalCrearShow}
          onClose={() => modalStates.setModalCrearShow(false)}
          campos={camposProgramacion}
          onSubmit={(programacion) => {
            handlers.guardarOActualizarProgramacion(programacion);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalCrearShow(false);
          }}
          programacionDisponibles={programacion}
          guardando={flags.guardando}
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

export default ProgramacionList;