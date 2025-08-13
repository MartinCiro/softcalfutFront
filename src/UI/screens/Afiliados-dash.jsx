import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import AfiliadoService from "@services/AfiliadoService"; // Services
import useSearch from "@hooks/useSearch"; // Hooks
import useHasPermission from "@hooks/useHasPermission";
import useFetchData from "@hooks/useFetchData";
import usePagination from "@hooks/usePagination";
import useErrorHandler from "@hooks/useErrorHandler";
import useModalConfirm from "@hooks/useModalConfirm";
import useToggleEstado from "@hooks/useToggleEstado";
import Paginator from "@componentsUseable/Paginator"; // Components
import CardGeneric from "@componentsUseable/CardGeneric";
import LoadingSpinner from "@componentsUseable/Loading";
import SearchInput from "@componentsUseable/SearchInput";
import ErrorMessage from "@componentsUseable/ErrorMessage";
import FilterDropdown from "@componentsUseable/Toggle/FilterDropdown";
import ScrollTopButton from "@componentsUseable/Toggle/ScrollTopButton";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Anuncio.css"; // Styles

const AfiliadosList = () => {
  const { data: afiliados, loading, error, reload: cargarAfiliados } = useFetchData(AfiliadoService.afiliados);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);
  const [afiliadoVer, setAfiliadoVer] = useState(null);
  const { query, setQuery, filtered } = useSearch(afiliados, ["president", "categories", "trainingLocation", "phone"]);
  const { estadoFiltro, toggleEstado, filtrarPorEstado } = useToggleEstado();
  const afiliadosFiltrados = filtrarPorEstado(filtered);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(afiliadosFiltrados, 6);
  const canCreate = useHasPermission('afiliados:Crea');
  const canEdit = useHasPermission('afiliados:Actualiza');

  const clavesAfiliado = {
    id: "id",
    title: "president",
    content: "categories",
    image: "logo",
    status: "status",
    subContent: "trainingLocation",
    extraInfo: "phone"
  };
  
  const confirmModal = useModalConfirm();

  const camposAfiliado = [
    { nombre: "president", label: "Presidente", tipo: "text" },
    { nombre: "phone", label: "Teléfono", tipo: "text" },
    { nombre: "categories", label: "Categorías", tipo: "text" },
    { nombre: "trainingLocation", label: "Lugar de entrenamiento", tipo: "text" },
    { nombre: "logo", label: "Logo afiliado", tipo: "file", accept: "image/*" },
  ];

  const handleEditar = (afiliado) => {
    setAfiliadoSeleccionado(afiliado);
    setModalShow(true);
  };

  const handleToggleActivo = (afiliado) => {
    const nuevoEstado = afiliado.status === "Activo" ? "Inactivo" : "Activo";
    const accion = nuevoEstado === "Activo" ? "activar" : "desactivar";
    const mensaje = `¿Deseas ${accion} el afiliado "${afiliado.president}"?`;

    confirmModal.open(mensaje, async () => {
      try {
        await AfiliadoService.upAfiliado(afiliado.id, { status: nuevoEstado });
        sessionStorage.removeItem("afiliados");
        await cargarAfiliados();
        setGuardando(true);
      } catch (err) {
        handleError(err);
      }
    });
  };

  const handleVer = (afiliado) => {
    setAfiliadoVer(afiliado);
    setModalVer(true);
  };

  const guardarOActualizarAfiliado = async (datosForm) => {
    const esEdicion = !!afiliadoSeleccionado?.id;
    try {
      setGuardando(true);
      setErrorGuardar({ message: null, variant: "danger" });

      const formData = new FormData();
      Object.keys(datosForm).forEach(key => {
        const value = datosForm[key];
        (key === 'logo' && value instanceof File)
          ? formData.append(key, value)
          : formData.append(key, value ?? '');
      });
      
      esEdicion 
        ? await AfiliadoService.upAfiliado(afiliadoSeleccionado.id, formData) 
        : await AfiliadoService.crAfiliado(formData);
        
      sessionStorage.removeItem("afiliados");
      await cargarAfiliados();
      setErrorGuardar({ 
        message: esEdicion 
          ? "Afiliado actualizado correctamente" 
          : "Afiliado creado correctamente", 
        variant: "success" 
      });
      
      if (esEdicion) {
        setModalShow(false);
        setAfiliadoSeleccionado(null);
      } else {
        setModalCrearShow(false);
      }
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 6000);
      setGuardando(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Afiliados</h2>

        <div className="d-flex align-items-center gap-2">
          {canCreate && (
            <Button
              variant="success"
              onClick={() => setModalCrearShow(true)}
              className="rounded-circle d-flex justify-content-center align-items-center btn_add"
              style={{ width: "45px", height: "45px" }}
              title="Crear Afiliado"
            >
              <MDBIcon fas icon="plus" />
            </Button>
          )}

          {canEdit && (<FilterDropdown estadoActual={estadoFiltro} onChange={toggleEstado} />)}

          <SearchInput value={query} onChange={setQuery} />
        </div>
      </div>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}
      
      <Row>
        <CardGeneric
          data={paginatedData}
          keys={clavesAfiliado}
          onToggle={handleToggleActivo}
          onView={handleVer}
          onEdit={canEdit ? handleEditar : null}
          showEdit={canEdit}
          showDelete={canEdit}
        />
      </Row>

      {/* Modal para editar */}
      {canEdit && modalShow && (
        <ModalEditForm
          show={modalShow}
          onClose={() => setModalShow(false)}
          titulo="Editar Afiliado"
          campos={camposAfiliado}
          datos={afiliadoSeleccionado}
          onSubmit={guardarOActualizarAfiliado}
          guardando={guardando}
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <ModalVerGenerico
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposAfiliado}
          datos={afiliadoVer}
          titulo={afiliadoVer.president}
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
          titulo="Crear Afiliado"
          campos={camposAfiliado}
          onSubmit={guardarOActualizarAfiliado}
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

export default AfiliadosList;