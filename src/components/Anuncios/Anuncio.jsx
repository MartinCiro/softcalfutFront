import { useState } from "react";
import AnuncioService from "@services/AnuncioService";
import useFetchData from "@hooks/useFetchData";
import useErrorHandler from "@hooks/useErrorHandler";
import LoadingSpinner from "@components/Loading/Loading";
import ErrorMessage from "@components/Error/ErrorMessage";
import ModalFormulario from "@components/FormModal/EditModalFormulario";
import ModalVerGenerico from "@components/FormModal/WhatchModalForm";
import CreateModalFormulario from "@components/FormModal/CreateModalFormulario";
import useSearch from "@hooks/useSearch";
import SearchInput from "@components/Search/SearchInput";
import useModalConfirm from "@hooks/useModalConfirm";
import ModalConfirmacion from "@components/ModalConfirm/ModalConfirmacion";
import useToggleEstado from "@hooks/useToggleEstado";
import ScrollTopButton from "@components/Toggle/ScrollTopButton";
import FilterDropdown from "@components/Toggle/FilterDropdown";

import "./Anuncio.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const AnunciosList = () => {
  const { data: anuncios, loading, error, reload: cargarAnuncios } = useFetchData(AnuncioService.anuncios);
  const { error: errorGlobal, handleError } = useErrorHandler();

  const [modalShow, setModalShow] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const [anuncioVer, setAnuncioVer] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const [guardando, setGuardando] = useState(false);
  const { query, setQuery, filtered } = useSearch(anuncios, "titulo");
  const { estadoFiltro, toggleEstado, filtrarPorEstado } = useToggleEstado();
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const confirmModal = useModalConfirm();

  const camposAnuncio = [
    { nombre: "titulo", label: "Título", tipo: "text" },
    { nombre: "contenido", label: "Contenido", tipo: "textarea" },
    { nombre: "imagenUrl", label: "URL de Imagen", tipo: "img" },
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
      esEdicion ? await AnuncioService.upAnuncio(anuncioSeleccionado.id, datosForm) : await AnuncioService.crAnuncio(datosForm);
      sessionStorage.removeItem("anuncios");
      await cargarAnuncios();

      setErrorGuardar({ message: esEdicion ? "Anuncio actualizado correctamente" : "Anuncio creado correctamente", variant: "success" });
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 3000);
      setGuardando(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (

    <Container className="py-4">
      {/* <h2 className="mb-4 text-center fw-bold">Anuncios</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Anuncios</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => setModalCrearShow(true)}
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "45px", height: "45px" }}
            title="Crear Anuncio"
          >
            <MDBIcon fas icon="plus" />
          </Button>
          <FilterDropdown estadoActual={estadoFiltro} onChange={toggleEstado} />
          <SearchInput value={query} onChange={setQuery} />
        </div>
      </div>


      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <Row>
        {filtrarPorEstado(filtered).map((anuncio) => (
          <Col key={`${anuncio.id}-${anuncio.estado}`} md={7} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm position-relative card-custom">
              <div className="position-relative clamp-image">
                <Card.Img
                  variant="top"
                  src={`${anuncio.imagenUrl}`}
                  alt={anuncio.titulo}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="clamp-tittle position-absolute bottom-0 w-100 text-center text-white bg-dark bg-opacity-75 py-2" style={{ fontWeight: "bold" }}>
                  {anuncio.titulo || "Sin título"}
                </div>
              </div>
              <Card.Body>
                <Card.Text className="clamp-text">
                  {anuncio.contenido || "Sin descripción"}
                </Card.Text>
                <div className="d-flex justify-content-between px-5 pb-3">
                  <Link
                    to="#"
                    className={`nav-link ${anuncio.estado === "Activo" ? "text-danger" : "text-success"}`}
                    onClick={() => handleToggleActivo(anuncio)}
                    title={anuncio.estado === "Activo" ? "Desactivar" : "Activar"}
                  >
                    <MDBIcon fas icon={anuncio.estado === "Activo" ? "trash" : "undo"} className="me-1" />
                  </Link>
                  <Link to="#" className="nav-link text-white" onClick={() => handleVer(anuncio)}>
                    <MDBIcon fas icon="eye" className="me-1" />
                  </Link>
                  <Link to="#" className="nav-link edit" onClick={() => handleEditar(anuncio)}>
                    <MDBIcon fas icon="pencil" className="me-1" />
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para editar */}
      {modalShow && (
        <ModalFormulario
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
          titulo="Crear Anuncio"
          campos={camposAnuncio}
          onSubmit={guardarOActualizarAnuncio}
          guardando={guardando}
        />
      )}
      <ScrollTopButton />
    </Container>
  );
};

export default AnunciosList;
