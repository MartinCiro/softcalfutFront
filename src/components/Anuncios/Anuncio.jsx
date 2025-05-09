import React, { useEffect, useState } from "react";
import AnuncioService from "@services/AnuncioService";
import LoadingSpinner from "@components/Loading/Loading";
import ErrorMessage from "@components/Error/ErrorMessage";
import ModalFormulario from "@components/FormModal/EditModalFormulario";
import ModalVerGenerico from "@components/FormModal/WhatchModalForm";
import "./Anuncio.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const AnunciosList = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalShow, setModalShow] = useState(false);
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });

  const [modalVer, setModalVer] = useState(false);
  const [anuncioVer, setAnuncioVer] = useState(null);


  const camposAnuncio = [
    { nombre: "titulo", label: "Título", tipo: "text" },
    { nombre: "contenido", label: "Contenido", tipo: "textarea" },
    { nombre: "imagenUrl", label: "URL de Imagen", tipo: "text" },
  ];

  const cargarAnuncios = async () => {
    try {
      setLoading(true);
      const { result } = await AnuncioService.anuncios();
      setAnuncios(result);
    } catch (err) {
      setError(err.message || "Error al cargar los anuncios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAnuncios();
  }, []);

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

      setAnuncios((prev) =>
        prev.map((a) =>
          a.id === anuncioSeleccionado.id
            ? { ...a, ...datosForm, nombre: datosForm.titulo }
            : a
        )
      );

      setErrorGuardar({ message: "Anuncio actualizado", variant: "success" });

      setTimeout(() => {
        setErrorGuardar({ message: null, variant: "danger" });
      }, 3000);
    } catch (err) {
      console.error("Error al guardar el anuncio:", err);
      setErrorGuardar({ message: "Error al guardar el anuncio.", variant: "danger" });

      setTimeout(() => {
        setErrorGuardar({ message: null, variant: "danger" });
      }, 3000);
    } finally {
      setGuardando(false);
    }
  };


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center fw-bold">Anuncios</h2>
      <Row>
        {anuncios.map((anuncio, index) => (
          <Col key={index} md={7} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm position-relative card-custom">
              <div className="position-relative clamp-image">
                <Card.Img
                  variant="top"
                  src={anuncio.imagenUrl}
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

      {/* Modal común para editar anuncios */}
      {modalShow && (
        <ModalFormulario
          show={modalShow}
          onClose={() => setModalShow(false)}
          titulo="Editar Anuncio"
          campos={camposAnuncio}
          datos={anuncioSeleccionado}
          onSubmit={handleGuardar}
          loading={guardando}
          error={errorGuardar}
          animation={false}
        />
      )}

      {/* Modal común para ver anuncios */}
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
