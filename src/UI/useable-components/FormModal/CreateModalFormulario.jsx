import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useErrorHandler from "@hooks/useErrorHandler";
import { useAutoResizeTextarea } from "@hooks/useAutoResizeTextarea";
import "@styles/Forms.css";

const CreateModalFormulario = ({
  show,
  onClose,
  titulo = "Crear nuevo",
  campos = [],
  onSubmit,
  loading: externalLoading = false,
  children,
  datos = null,
  onChange = null,
}) => {
  const [formState, setFormState] = useState({});
  const [mensajeExito, setMensajeExito] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { error, handleError, resetError } = useErrorHandler();
  const textareaRefs = useRef({});

  // Si se pasa un estado externo (datos), sincronízalo al abrir el modal
  useEffect(() => {
    if (datos && Object.keys(datos).length > 0) {
      setFormState(datos);
    }
  }, [datos]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualiza estado interno
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Si se pasa una función onChange externa, notifícale el cambio
    if (typeof onChange === "function") {
      onChange(name, value);
    }
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
          {campos.map((campo) => {
            const isTextarea = campo.tipo === "textarea";
            const value = formState[campo.nombre] || "";
            const textareaRef = isTextarea ? useAutoResizeTextarea(value) : null;

            return (
              <Form.Group key={campo.nombre} className="mb-3 create-form">
                <Form.Label>{campo.label || campo.nombre}</Form.Label>

                {campo.tipo === "img" ? (
                  <Form.Control
                    type="text"
                    name={campo.nombre}
                    value={formState[campo.nombre] || ""}
                    onChange={handleChange}
                    placeholder="URL de la imagen"
                  />
                ) : (
                  <Form.Control
                    as={isTextarea ? "textarea" : "input"}
                    type={isTextarea ? undefined : campo.tipo}
                    rows={isTextarea ? 6 : undefined}
                    style={
                      isTextarea
                        ? { minHeight: "120px", resize: "vertical", overflow: "hidden" }
                        : {}
                    }
                    name={campo.nombre}
                    value={formState[campo.nombre] || ""}
                    onChange={handleChange}
                    placeholder={campo.placeholder || ""}
                    ref={textareaRef}
                  />
                )}
              </Form.Group>
            );
          })}
        </Form>
        {children}
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
          {guardando || externalLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModalFormulario;
