import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import EquipoService from "@services/EquipoService"; // Services
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
import ModalVerEquipo from "@componentsUseable/Equipos/ModalVerEquipo";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css"; // Styles

const EquiposList = () => {
  const { data: equipos, loading, error, reload: cargarEquipos } = useFetchData(EquipoService.equipos);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [equipoVer, setEquipoVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(equipos, "nom_equipo");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsEquipo = [
    { key: "nom_equipo", label: "Nombre del equipo" },
    {
      key: "representante",
      label: "Nombre del representante",
      render: (rep) => rep ? `${rep.nombres}` : "Sin representante"
    }
  ];
  const confirmModal = useModalConfirm();

  const camposEquipo = [
    { nombre: "nom_equipo", label: "Nombre" },
    {
      nombre: "nombre_representante",
      label: "Representante",
      render: (_, datos) => datos.representante?.nombres || "Sin representante"
    },
    {
      nombre: "documento_representante",
      label: "Documento del representante",
      render: (_, datos) => datos.representante?.documento || "Sin documento"
    }
  ];


  const handleEditar = (equipo) => {
    setModoEdicion(true);
    setEquipoSeleccionado(equipo);
    setModalShow(true);
  };

  const handleVer = (equipo) => {
    setEquipoVer(equipo);
    setModalVer(true);
  };

  const guardarOActualizarEquipo = async (datosForm) => {
    const esEdicion = modoEdicion;
    const datosTransformados = {
      ...datosForm,
      nombre: datosForm.nombre_equipo,
    };
    delete datosTransformados.nombre_equipo;
    try {
      setGuardando(true);
      esEdicion ? await EquipoService.upEquipo(datosTransformados) : await EquipoService.crEquipo(datosTransformados);
      sessionStorage.removeItem("equipos");
      await cargarEquipos();
      setErrorGuardar({ message: esEdicion ? "Equipo actualizado correctamente" : "Equipo creado correctamente", variant: "success" });
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
      {/* <h2 className="mb-4 text-center fw-bold">Equipos</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Equipos</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              setModoEdicion(false);
              setEquipoSeleccionado(null);
              setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "45px", height: "45px" }}
            title="Crear Equipo"
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
        columns={columnsEquipo}
        onEdit={handleEditar}
        onView={handleVer}
      />

      {/* Modal para editar */}
      {modalShow && equipoSeleccionado && (
        <ModalEditForm
          titulo={"Editar Equipo"}
          show={modalShow}
          onClose={() => setModalShow(false)}
          datos={equipoSeleccionado}
          campos={camposEquipo}
          onSubmit={(nuevosEquipos) => {
            const datosForm = {
              ...equipoSeleccionado,
              ...nuevosEquipos
            };
            guardarOActualizarEquipo(datosForm);
            setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <ModalVerEquipo
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposEquipo}
          datos={equipoVer}
          titulo={"Detalles del equipo"}
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
          campos={camposEquipo}
          onSubmit={guardarOActualizarEquipo}
          equiposDisponibles={equipos}
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

export default EquiposList;