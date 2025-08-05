import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import AnuncioService from "@services/AnuncioService"; // Services
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
import AfiliadosScreen from "@screens/Afiliados";
import "@styles/Anuncio.css"; // Styles

const AnunciosList = () => {
  const { data: anuncios, loading, error, reload: cargarAnuncios } = useFetchData(AnuncioService.anuncios);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const [anuncioVer, setAnuncioVer] = useState(null);
  const { query, setQuery, filtered } = useSearch(anuncios, ["titulo", "contenido"]);
  const { estadoFiltro, toggleEstado, filtrarPorEstado } = useToggleEstado();
  const anunciosFiltrados = filtrarPorEstado(filtered);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(anunciosFiltrados, 6);
  const canCreate = useHasPermission('anuncios:Crea');
  const canEdit = useHasPermission('anuncios:Actualiza');

  const clavesAnuncio = {
    id: "id",
    title: "titulo",
    content: "contenido",
    image: "imagenUrl",
    status: "estado",
  };
  const confirmModal = useModalConfirm();

  const camposAnuncio = [
    { nombre: "titulo", label: "Título", tipo: "text" },
    { nombre: "contenido", label: "Contenido", tipo: "textarea" },
    { nombre: "imagenUrl", label: "Imagen de portada", tipo: "file", accept: "image/*" },
  ];

  const handleEditar = (anuncio) => {
    setAnuncioSeleccionado(anuncio);
    setModalShow(true);
  };

  const handleToggleActivo = (anuncio) => {
    const nuevoEstado = anuncio.estado === "Activo" ? "Inactivo" : "Activo";
    const accion = nuevoEstado === "Activo" ? "activar" : "desactivar";
    const mensaje = `¿Deseas ${accion} el anuncio "${anuncio.titulo}"?`;

    confirmModal.open(mensaje, async () => {
      try {
        await AnuncioService.upAnuncio(anuncio.id, { estado: nuevoEstado });
        sessionStorage.removeItem("anuncios");
        await cargarAnuncios();
        setGuardando(true);
      } catch (err) {
        handleError(err);
      }
    });
  };

  const handleVer = (anuncio) => {
    setAnuncioVer(anuncio);
    setModalVer(true);
  };

  const guardarOActualizarAnuncio = async (datosForm) => {
    const esEdicion = !!anuncioSeleccionado?.id;
    try {
      setGuardando(true);
      setErrorGuardar({ message: null, variant: "danger" });

      const formData = new FormData();
      Object.keys(datosForm).forEach(key => {
        const value = datosForm[key];
        (key === 'imagenUrl' && value instanceof File)
          ? formData.append(key, value)
          : formData.append(key, value ?? '');
      });
      esEdicion ? await AnuncioService.upAnuncio(anuncioSeleccionado.id, formData) : await AnuncioService.crAnuncio(formData);
      sessionStorage.removeItem("anuncios");
      await cargarAnuncios();
      setErrorGuardar({ message: esEdicion ? "Anuncio actualizado correctamente" : "Anuncio creado correctamente", variant: "success" });
      if (esEdicion) {
        setModalShow(false);
        setAnuncioSeleccionado(null);
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
      {/* <h2 className="mb-4 text-center fw-bold">Anuncios</h2> */}
      <Row>
        <AfiliadosScreen hideDetails={true} />
      </Row>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Noticias</h2>

        <div className="d-flex align-items-center gap-2">
          {canCreate && (
            <Button
              variant="success"
              onClick={() => setModalCrearShow(true)}
              className="rounded-circle d-flex justify-content-center align-items-center btn_add"
              style={{ width: "45px", height: "45px" }}
              title="Crear Anuncio"
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
          keys={clavesAnuncio}
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
          titulo="Editar Anuncio"
          campos={camposAnuncio}
          datos={anuncioSeleccionado}
          onSubmit={guardarOActualizarAnuncio}
          guardando={guardando}
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <ModalVerGenerico
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposAnuncio}
          datos={anuncioVer}
          titulo={anuncioVer.titulo}
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
          titulo="Crear Anuncio"
          campos={camposAnuncio}
          onSubmit={guardarOActualizarAnuncio}
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

export default AnunciosList;