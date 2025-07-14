import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import EquipoService from "@services/EquipoService"; // Services
import UsuarioService from "@services/UsuarioService";
import CategoriaService from "@services/CategoriaService";
import useSearch from "@hooks/useSearch"; // Hooks
import useHasPermission from "@hooks/useHasPermission";
import useFetchData from "@hooks/useFetchData";
import usePagination from "@hooks/usePagination";
import useModalConfirm from "@hooks/useModalConfirm";
import Paginator from "@componentsUseable/Paginator"; // Components
import LoadingSpinner from "@componentsUseable/Loading";
import SearchInput from "@componentsUseable/SearchInput";
import ErrorMessage from "@componentsUseable/ErrorMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import ScrollTopButton from "@componentsUseable/Toggle/ScrollTopButton";
import ModalVerEquipo from "@componentsUseable/Equipos/ModalVerEquipo";
import ModalEditEquipo from "@componentsUseable/Equipos/ModalEditEquipo";
import ModalCreateEquipo from "@componentsUseable/Equipos/ModalCreateEquipo";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";

import { useEquiposLogic } from "@hooks/equipo/useEquiposLogic";
import { columnsEquipo, camposEquipo } from "@constants/equiposConfig";
import "@styles/Permiso.css"; // Styles

const EquiposList = () => {
  const { data: equipos, loading, error, reload: cargarEquipos } = useFetchData(EquipoService.equipos);
  const { data: categorias } = useFetchData(CategoriaService.categorias);
  const { data: usuarios } = useFetchData(UsuarioService.usuarios);
  const canCreate = useHasPermission('equipos:Crea');
  const canEdit = useHasPermission('equipos:Actualiza');
  const canView = useHasPermission('equipos:Lee');
  const { modalStates, equipoStates, flags, errorGuardar, handlers } = useEquiposLogic(cargarEquipos, { canCreate, canEdit, canView });
  const { query, setQuery, filtered } = useSearch(equipos, ["nom_equipo"]);
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);

  const confirmModal = useModalConfirm();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!canView) return <div>No tienes permisos para ver equipos</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Equipos</h2>

        <div className="d-flex align-items-center gap-2">
              {canCreate && (
                <Button
                  variant="success"
                  onClick={handlers.handleCrear}
                  className="rounded-circle d-flex justify-content-center align-items-center btn_add"
                  style={{ width: "45px", height: "45px" }}
                  title="Crear Equipo"
                >
                <MDBIcon fas icon="plus" />
                </Button>
              )}
              {
                canView && (
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
        columns={columnsEquipo}
        onEdit={handlers.handleEditar}
        showEdit={canEdit}
        showView={canView}
        onView={handlers.handleVer}
        sinDatos={"No se encontraron equipos"}
      />

      {/* Modal para editar */}
      {modalStates.modalShow && equipoStates.equipoSeleccionado && (
        <ModalEditEquipo
          titulo={"Editar Equipo"}
          show={modalStates.modalShow}
          onClose={() => modalStates.setModalShow(false)}
          datos={equipoStates.equipoSeleccionado}
          campos={camposEquipo}
          usuarios={usuarios}
          categorias={categorias}
          onSubmit={(nuevosEquipos) => {
            const datosForm = {
              ...equipoStates.equipoSeleccionado,
              ...nuevosEquipos
            };
            handlers.guardarOActualizarEquipo(datosForm);
            modalStates.setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalStates.modalVer && (
        <ModalVerEquipo
          show={modalStates.modalVer}
          onClose={() => modalStates.setModalVer(false)}
          campos={camposEquipo}
          datos={equipoStates.equipoVer}
          titulo={"Detalles del equipo"}
        />
      )}

      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />

      {modalStates.modalCrearShow && (
        <ModalCreateEquipo
          show={modalStates.modalCrearShow}
          onClose={() => modalStates.setModalCrearShow(false)}
          campos={camposEquipo}
          onSubmit={handlers.guardarOActualizarEquipo}
          equiposDisponibles={equipos}
          guardando={flags.guardando}
          usuarios={usuarios}
          categorias={categorias}
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

export default EquiposList;