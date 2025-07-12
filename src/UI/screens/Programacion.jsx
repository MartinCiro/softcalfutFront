import { Container, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import ProgramacionService from "@services/ProgramacionService"; // Services
import EquipoService from "@services/EquipoService";
import LugarService from "@services/LugarEncuentroService";
import CategoriaService from "@services/CategoriaService";
import TorneoService from "@services/TorneoService";
import useFetchData from "@hooks/useFetchData"; // Hooks
import LoadingSpinner from "@componentsUseable/Loading"; // Components
import ErrorMessage from "@componentsUseable/ErrorMessage";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditProgramacion from "@componentsUseable/Programacion/ModalEditEquipo";
import ModalCreateProgramacion from "@componentsUseable/Programacion/ModalCreateProgramacion";
import Calendar from "@componentsUseable/Programacion/Calendar";

import { useProgramacionLogic } from "@hooks/programacion/useProgramacionLogic";
import { columnsProgramacion, camposProgramacion } from "@constants/programacionConfig";
import useHasPermission from "@hooks/useHasPermission";

import "@styles/Permiso.css"; // Styles

const ProgramacionList = () => {
  const { data: programacion, loading, error, reload: cargarProgramacion } = useFetchData(ProgramacionService.programacion);
  const { data: equipos } = useFetchData(EquipoService.equipos);
  const { data: lugares } = useFetchData(LugarService.lugarEncuentro);
  const { data: categorias } = useFetchData(CategoriaService.categorias);
  const { data: torneos } = useFetchData(TorneoService.torneos);
  const canCreate = useHasPermission('programaciones:Crea');
  const canEdit = useHasPermission('programaciones:Actualiza');
  
  const { modalStates, programacionStates, flags, errorGuardar, handlers } = useProgramacionLogic(cargarProgramacion);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const handleEditEvento = (eventoEditado) => {
    // Buscar competencia y evento original
    const competencia = programacion.find(c =>c.eventos.some(e =>e.id === eventoEditado.id));
    if (!competencia) return;
    const eventoOriginal = competencia.eventos.find(e => e.id === eventoEditado.id);

    const eventoCompleto = {
      ...eventoOriginal,
      ...eventoEditado,
      competencia: competencia.competencia,
      categoria: eventoEditado.categoria
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

        {canCreate && (
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
              title="Crear programacion"
            >
              <MDBIcon fas icon="plus" />
            </Button>
          </div>
        )}
      </div>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <Calendar data={programacion} onEditEvento={canEdit ? handleEditEvento : null} canEdit={canEdit}/>

      {/* Modal para editar */}
      {canEdit && modalStates.modalShow && programacionStates.programacionSeleccionado && (
        <ModalEditProgramacion
          titulo={"Editar Programacion"}
          show={modalStates.modalShow}
          onClose={() => modalStates.setModalShow(false)}
          onSubmit={(nuevosProgramacion) => {
            const datosForm = {
              ...programacionStates.programacionSeleccionado,
              ...nuevosProgramacion
            };
            handlers.guardarOActualizarProgramacion(datosForm);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalShow(false);
          }}
          datos={programacionStates.programacionSeleccionado}
          equipos={equipos}
          lugares={lugares}
          categorias={categorias}
          torneos={torneos}
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

      {canCreate && modalStates.modalCrearShow && (
        <ModalCreateProgramacion
          show={modalStates.modalCrearShow}
          onClose={() => modalStates.setModalCrearShow(false)}
          onSubmit={(programacion) => {
            handlers.guardarOActualizarProgramacion(programacion);
            if (!errorGuardar.message || errorGuardar.variant === "success") modalStates.setModalCrearShow(false);
          }}
          programacionDisponibles={programacion}
          guardando={flags.guardando}
          equipos={equipos}
          lugares={lugares}
          categorias={categorias}
          torneos={torneos}
        />
      )}
    </Container>
  );
};

export default ProgramacionList;