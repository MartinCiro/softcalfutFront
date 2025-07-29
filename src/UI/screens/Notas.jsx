import { Container, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import NotaService from "@services/NotaService"; // Services
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
import ModalVerNota from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditNota from "@componentsUseable/FormModal/EditModalFormulario";
import ModalCreateNota from "@componentsUseable/FormModal/CreateModalFormulario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";

import { useNotasLogic } from "@hooks/nota/useNotasLogic";
import { columnsNota, camposNota } from "@constants/notasConfig";
import "@styles/Permiso.css"; // Styles

const NotasList = () => {
  const { data: notas, loading, error, reload: cargarNotas } = useFetchData(NotaService.notas);
  const { modalStates, notaStates, flags, errorGuardar, handlers } = useNotasLogic(cargarNotas);
  const { query, setQuery, filtered } = useSearch(notas, ["nombre"]);
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);

  const confirmModal = useModalConfirm();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (

    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Notas</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              flags.setModoEdicion(false);
              notaStates.setNotaSeleccionado(null);
              modalStates.setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center btn_add"
            style={{ width: "45px", height: "45px" }}
            title="Crear Nota"
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
        columns={columnsNota}
        onEdit={handlers.handleEditar}
        onView={handlers.handleVer}
        sinDatos={"No se encontraron notas"}
      />

      {/* Modal para editar */}
      {modalStates.modalShow && notaStates.notaSeleccionado && (
        <ModalEditNota
          titulo={"Editar Nota"}
          show={modalStates.modalShow}
          onClose={() => modalStates.setModalShow(false)}
          datos={notaStates.notaSeleccionado}
          campos={camposNota}
          onSubmit={(nuevosNotas) => {
            const datosForm = {
              ...notaStates.notaSeleccionado,
              ...nuevosNotas
            };
            handlers.guardarOActualizarNota(datosForm);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalStates.modalVer && (
        <ModalVerNota
          show={modalStates.modalVer}
          onClose={() => modalStates.setModalVer(false)}
          campos={camposNota}
          datos={notaStates.notaVer}
          titulo={"Detalles del nota"}
        />
      )}

      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />

      {modalStates.modalCrearShow && (
        <ModalCreateNota
          show={modalStates.modalCrearShow}
          onClose={() => modalStates.setModalCrearShow(false)}
          campos={camposNota}
          onSubmit={(nota)=> {
            handlers.guardarOActualizarNota(nota);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalCrearShow(false);
          }}
          notasDisponibles={notas}
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

export default NotasList;