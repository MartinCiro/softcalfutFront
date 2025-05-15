import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useErrorHandler from "@hooks/useErrorHandler";

const ModalFormulario = ({
  show,
  onClose,
  titulo = "Formulario",
  campos = [],
  datos = {},
  onSubmit,
  loading: externalLoading = false,
}) => {
  const [formState, setFormState] = useState({});
  const [mensajeExito, setMensajeExito] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { error, handleError, resetError } = useErrorHandler();

  useEffect(() => {
    if (JSON.stringify(formState) !== JSON.stringify(datos)) {
      setFormState(datos || {});
      setMensajeExito(null);
      resetError();
    }
  }, [datos, show]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    try {
      setGuardando(true);
      await onSubmit(formState);
      setMensajeExito("Actualizado correctamente");
    } catch (err) {
      handleError(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered animation={false}>
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
                  {formState[campo.nombre] ? (
                    <img
                      src={formState[campo.nombre]}
                      alt={campo.label || campo.nombre}
                      style={{ maxWidth: "100%", maxHeight: "300px", display: "block", marginBottom: "10px" }}
                    />
                  ) : (
                    <p className="text-muted">No hay imagen cargada</p>
                  )}
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
        <Button variant="secondary" onClick={onClose}>
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

export default ModalFormulario;
