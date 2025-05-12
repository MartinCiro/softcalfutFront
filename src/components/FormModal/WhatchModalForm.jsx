import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalVerGenerico = ({
  show,
  onClose,
  titulo = "Detalle",
  campos = [],
  datos = {},
}) => {
  if (!datos) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {campos.map((campo) => {
          const valor = datos[campo.nombre];

          if (campo.tipo === "imagen" && valor) {
            return (
              <div key={campo.nombre} className="mb-3 text-center">
                <img
                  src={valor}
                  alt={campo.label || campo.nombre}
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </div>
            );
          }

          return (
            <div key={campo.nombre} className="mb-3">
              <strong>{campo.label || campo.nombre}:</strong>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
                {valor || "Sin información"}
              </p>
            </div>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVerGenerico;
