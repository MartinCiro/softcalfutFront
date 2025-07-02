import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import CardGeneric from "@componentsUseable/CardGeneric";
import CameraCarousel from "@componentsUseable/CameraCarousel";
import "@styles/CarruselCards.css"; // Archivo CSS para estilos específicos

const CarruselCards = ({
  data = [],
  keys = {
    id: "id",
    image: "image",
    title: "title",
    content: "content",
    status: "status"
  },
  height = "400px",
  autoPlay = true,
  showNavigation = true,
  showPagination = true,
  onView,
  onToggle,
  onEdit, // Nueva prop para manejar edición
  onImageClick,
  showActionsInModal = true,
  modalSize = "lg"
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleImageClickInternal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
    if (onImageClick) onImageClick(item);
  };

  const handleCloseModal = () => setShowDetailModal(false);

  return (
    <div className="carrusel-cards-container">
      {/* Componente Carrusel */}
      <CameraCarousel
        data={data}
        keys={keys}
        height={height}
        autoPlay={autoPlay}
        showNavigation={showNavigation}
        showPagination={showPagination}
        onView={onView}
        onToggle={onToggle}
        onImageClick={handleImageClickInternal}
      />

      {/* Modal para mostrar detalles */}
      <Modal
        show={showDetailModal}
        onHide={handleCloseModal}
        size={modalSize}
        centered
        className="carrusel-cards-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="fw-bold text-truncate">
            {selectedItem?.[keys.title] || "Detalles"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedItem && (
            <Row className="g-4">
              {/* Columna de la imagen */}
              <Col md={6} className="image-column">
                <div className="image-container">
                  <img
                    src={selectedItem[keys.image]}
                    alt={selectedItem[keys.title] || "Imagen"}
                    className="img-fluid rounded shadow"
                    loading="lazy"
                  />
                </div>
              </Col>

              {/* Columna del contenido */}
              <Col md={6} className="content-column">
                <div className="content-wrapper">
                  <h3 className="title-custom fw-bold mb-3">
                    {selectedItem[keys.title]}
                  </h3>
                  
                  <div className="content-text mb-4">
                    {selectedItem[keys.content]}
                  </div>

                  {/* Acciones */}
                  {showActionsInModal && (
                    <div className="actions-wrapper d-flex flex-wrap gap-2">
                      {onView && (
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            handleCloseModal();
                            onView(selectedItem);
                          }}
                          className="action-btn"
                        >
                          <MDBIcon fas icon="eye" className="me-2" />
                          Ver más
                        </Button>
                      )}
                      
                      {onEdit && (
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            handleCloseModal();
                            onEdit(selectedItem);
                          }}
                          className="action-btn"
                        >
                          <MDBIcon fas icon="pencil" className="me-2" />
                          Editar
                        </Button>
                      )}
                      
                      {onToggle && (
                        <Button
                          variant={
                            selectedItem[keys.status] === "Activo" 
                              ? "outline-danger" 
                              : "outline-success"
                          }
                          onClick={() => {
                            handleCloseModal();
                            onToggle(selectedItem);
                          }}
                          className="action-btn"
                        >
                          <MDBIcon
                            fas
                            icon={
                              selectedItem[keys.status] === "Activo" 
                                ? "trash" 
                                : "undo"
                            }
                            className="me-2"
                          />
                          {selectedItem[keys.status] === "Activo" 
                            ? "Desactivar" 
                            : "Activar"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CarruselCards;