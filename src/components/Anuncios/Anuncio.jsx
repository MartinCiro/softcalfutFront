import { useState } from "react";
import AnuncioService from "@services/AnuncioService";
import useFetchData from "@hooks/useFetchData"; // ✅ Hook personalizado para obtener y recargar datos
import useErrorHandler from "@hooks/useErrorHandler"; // ✅ Hook personalizado para manejar errores
import LoadingSpinner from "@components/Loading/Loading";
import ErrorMessage from "@components/Error/ErrorMessage";
import ModalFormulario from "@components/FormModal/EditModalFormulario";
import ModalVerGenerico from "@components/FormModal/WhatchModalForm";
import "./Anuncio.css";
import { Container, Row, Col, Card } from "react-bootstrap";
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

  const camposAnuncio = [
    { nombre: "titulo", label: "Título", tipo: "text" },
    { nombre: "contenido", label: "Contenido", tipo: "textarea" },
    { nombre: "imagenUrl", label: "URL de Imagen", tipo: "img" },
  ];

  const handleEditar = (anuncio) => {
    setAnuncioSeleccionado(anuncio);
    setModalShow(true);
  };

  const handleVer = (anuncio) => {
    setAnuncioVer(anuncio);
    setModalVer(true);
  };

  const handleGuardar = async (datosForm) => {
    try {
      setGuardando(true);
      await AnuncioService.upAnuncio(anuncioSeleccionado.id, datosForm);
      await cargarAnuncios();
      
      setErrorGuardar({ message: "Anuncio actualizado correctamente", variant: "success" });
      sessionStorage.removeItem("anuncios");
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
      <h2 className="mb-4 text-center fw-bold">Anuncios</h2>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <Row>
        {anuncios.map((anuncio) => (
          <Col key={anuncio.id} md={7} lg={4} className="mb-4">
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
                  <Link to="#" className="nav-link text-danger">
                    <MDBIcon fas icon="trash" className="me-1" />
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
          onSubmit={handleGuardar}
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
    </Container>
  );
};

export default AnunciosList;
