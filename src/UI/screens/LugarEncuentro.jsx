import { Container, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import LugarEncuentroService from "@services/LugarEncuentroService"; // Services
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

import { useLugarEncuentroLogic } from "@hooks/lugarEncuentro/useLugarEncuentroLogic";
import { columnsLugarEncuentro, camposLugarEncuentro } from "@constants/lugarEncuentroConfig";
import "@styles/Permiso.css"; // Styles
import useHasPermission from "@hooks/useHasPermission";

const LugarEncuentroList = () => {
  const { data: lugarEncuentro, loading, error, reload: cargarLugarEncuentro } = useFetchData(LugarEncuentroService.lugarEncuentro);
  const { modalStates, lugarEncuentroStates, flags, errorGuardar, handlers } = useLugarEncuentroLogic(cargarLugarEncuentro);
  const { query, setQuery, filtered } = useSearch(lugarEncuentro, "nombre");
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);

  const confirmModal = useModalConfirm();
  const canCreate = useHasPermission('lugarEncuentro:Crea');
  const canEdit = useHasPermission('lugarEncuentro:Actualiza');
  const canView = useHasPermission('lugarEncuentro:Lee');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!canView) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          No tienes permisos para ver los lugares de encuentro.
        </div>
      </Container>
    );
  }
  return (

    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Lugar de encuentro</h2>
        <div className="d-flex align-items-center gap-2">
          {canCreate && (  
            <Button
              variant="success"
              onClick={() => {
                flags.setModoEdicion(false);
                lugarEncuentroStates.setLugarEncuentroSeleccionado(null);
                modalStates.setModalCrearShow(true);
              }}
              className="rounded-circle d-flex justify-content-center align-items-center btn_add"
              style={{ width: "45px", height: "45px" }}
              title="Crear LugarEncuentro"
            >
              <MDBIcon fas icon="plus" />
            </Button>
          )}
          {canView && (
            <SearchInput value={query} onChange={setQuery} />
          )
          }
        </div>
      </div>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <TableGeneric
        data={paginatedData}
        columns={columnsLugarEncuentro}
        onEdit={handlers.handleEditar}
        onView={handlers.handleVer}
        sinDatos={"No se han encontrado lugares de encuentro"}
        showEdit={canEdit}
        showView={canView}
      />

      {/* Modal para editar */}
      {canEdit && modalStates.modalShow && lugarEncuentroStates.lugarEncuentroSeleccionado && (
        <ModalEditGenerico
          titulo={"Editar LugarEncuentro"}
          show={modalStates.modalShow}
          onClose={() => modalStates.setModalShow(false)}
          datos={lugarEncuentroStates.lugarEncuentroSeleccionado}
          campos={camposLugarEncuentro}
          onSubmit={(nuevosLugarEncuentro) => {
            const datosForm = {
              ...lugarEncuentroStates.lugarEncuentroSeleccionado,
              ...nuevosLugarEncuentro
            };
            handlers.guardarOActualizarLugarEncuentro(datosForm);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {canView && modalStates.modalVer && (
        <ModalVerGenerico
          show={modalStates.modalVer}
          onClose={() => modalStates.setModalVer(false)}
          campos={camposLugarEncuentro}
          datos={lugarEncuentroStates.lugarEncuentroVer}
          titulo={"Detalles del lugarEncuentro"}
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

      {canCreate && modalStates.modalCrearShow && (
        <ModalCreateGenerico
          show={modalStates.modalCrearShow}
          onClose={() => modalStates.setModalCrearShow(false)}
          campos={camposLugarEncuentro}
          onSubmit={(lugarEncuentro)=> {
            handlers.guardarOActualizarLugarEncuentro(lugarEncuentro);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalCrearShow(false);
          }}
          lugarEncuentroDisponibles={lugarEncuentro}
          guardando={flags.guardando}
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

export default LugarEncuentroList;