import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useErrorHandler from "@hooks/useErrorHandler";

const CreateModalFormulario = ({
  show,
  onClose,
  titulo = "Crear nuevo",
  campos = [],
  onSubmit,
  loading: externalLoading = false,
}) => {
  const [formState, setFormState] = useState({});
  const [mensajeExito, setMensajeExito] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { error, handleError, resetError } = useErrorHandler();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    try {
      setGuardando(true);
      resetError();
      await onSubmit(formState);
      setMensajeExito("Creado correctamente");
      setFormState({}); 
    } catch (err) {
      handleError(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormState({});
    setMensajeExito(null);
    resetError();
  };

  return (
    <Modal show={show} onHide={handleClose} centered animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensajeExito && (
          <Alert variant="success" className="text-center">
            {mensajeExito}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Form>
          {campos.map((campo) => (
            <Form.Group key={campo.nombre} className="mb-3">
              <Form.Label>{campo.label || campo.nombre}</Form.Label>

              {campo.tipo === "img" ? (
                <>
                  <Form.Control
                    type="text"
                    name={campo.nombre}
                    value={formState[campo.nombre] || ""}
                    onChange={handleChange}
                    placeholder="URL de la imagen"
                  />
                </>
              ) : (
                <Form.Control
                  as={campo.tipo === "textarea" ? "textarea" : "input"}
                  type={campo.tipo === "textarea" ? undefined : campo.tipo}
                  rows={campo.tipo === "textarea" ? 6 : undefined}
                  style={campo.tipo === "textarea" ? { minHeight: "120px", resize: "vertical" } : {}}
                  name={campo.nombre}
                  value={formState[campo.nombre] || ""}
                  onChange={handleChange}
                  placeholder={campo.placeholder || ""}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={guardando || externalLoading}
        >
          {(guardando || externalLoading) ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModalFormulario;
