import { Container, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import ProgramacionService from "@services/ProgramacionService"; // Services
import EquipoService from "@services/EquipoService";
import LugarService from "@services/LugarEncuentroService";
import CategoriaService from "@services/CategoriaService";
import useFetchData from "@hooks/useFetchData"; // Hooks
import LoadingSpinner from "@componentsUseable/Loading"; // Components
import ErrorMessage from "@componentsUseable/ErrorMessage";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditProgramacion from "@componentsUseable/Programacion/ModalEditEquipo";
import ModalCreateGenerico from "@componentsUseable/FormModal/CreateModalFormulario";
import Calendar from "@componentsUseable/Programacion/Calendar";

import { useProgramacionLogic } from "@hooks/programacion/useProgramacionLogic";
import { columnsProgramacion, camposProgramacion } from "@constants/programacionConfig";
import "@styles/Permiso.css"; // Styles

const ProgramacionList = () => {
  const { data: programacion, loading, error, reload: cargarProgramacion } = useFetchData(ProgramacionService.programacion);
  const { data: equipos } = useFetchData(EquipoService.equipos);
  const { data: lugares } = useFetchData(LugarService.lugarEncuentro);
  const { data: categorias } = useFetchData(CategoriaService.categorias);
  const { modalStates, programacionStates, flags, errorGuardar, handlers } = useProgramacionLogic(cargarProgramacion);

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
      competencia: competencia.competencia,
      categoria: eventoEditado.categoria
    };

    console.log(eventoCompleto);

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
        <ModalEditProgramacion
          titulo={"Editar Programacion"}
          show={modalStates.modalShow}
          onClose={() => modalStates.setModalShow(false)}
          datos={programacionStates.programacionSeleccionado}
          lugares={lugares}
          equipos={equipos}
          categorias={categorias}
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
    </Container>
  );
};

export default ProgramacionList;