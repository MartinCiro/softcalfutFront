import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ErrorMessage from "@components/Error/ErrorMessage"; // Asegúrate de tener esta ruta

const ModalFormulario = ({
  show,
  onClose,
  titulo = "Formulario",
  campos = [],
  datos = {},
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formState, setFormState] = useState({});

  useEffect(() => {
    setFormState(datos || {});
  }, [datos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(formState);
  };

  return (
    <Modal show={show} onHide={onClose} centered animation={false}> {/* Aquí agregamos animation={false} */}
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Usa tu componente personalizado aquí */}
        {error?.message && (
          <ErrorMessage message={error.message} variant={error.variant || "danger"} />
        )}
        <Form>
          {campos.map((campo) => (
            <Form.Group key={campo.nombre} className="mb-3">
              <Form.Label>{campo.label || campo.nombre}</Form.Label>
              <Form.Control
                as={campo.tipo === "textarea" ? "textarea" : "input"}
                type={campo.tipo === "textarea" ? undefined : campo.tipo}
                rows={campo.tipo === "textarea" ? 4 : undefined}
                name={campo.nombre}
                value={formState[campo.nombre] || ""}
                onChange={handleChange}
                placeholder={campo.placeholder || ""}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalFormulario;
