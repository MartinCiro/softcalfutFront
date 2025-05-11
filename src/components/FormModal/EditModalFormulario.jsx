import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ErrorMessage from "@components/Error/ErrorMessage";
import useFormSubmitter from "@hooks/useFormSubmitter";

const ModalFormulario = ({
  show,
  onClose,
  titulo = "Formulario",
  campos = [],
  datos = {},
  onSubmit,
  loading = false,
  redirectPath = null, // opcional: para navegar si el submit fue exitoso
  cerrarAlEnviar = true, // opcional: para cerrar el modal al enviar
}) => {
  const [formState, setFormState] = useState({});
  const { submitForm, error } = useFormSubmitter();

  useEffect(() => {
    setFormState(datos || {});
  }, [datos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!onSubmit) return;

    submitForm(
      async () => {
        await onSubmit(formState);
        if (cerrarAlEnviar) onClose();
      },
      redirectPath
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <ErrorMessage message={error} />}
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
