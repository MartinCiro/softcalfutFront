import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useErrorHandler from "@hooks/useErrorHandler";
import { useAutoResizeTextarea } from "@hooks/useAutoResizeTextarea";

const ModalEditForm = ({
  show,
  onClose,
  titulo = "Formulario",
  campos = [],
  datos = {},
  onSubmit,
  loading: externalLoading = false,
  children,
  onChange = () => { },
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
    if (onChange) onChange(name, value);
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
          {campos.map((campo) => {
            const isTextarea = campo.tipo === "textarea";
            const value = formState[campo.nombre] || "";
            const textareaRef = isTextarea ? useAutoResizeTextarea(value) : null;

            return (
              <Form.Group key={campo.nombre} className="mb-3">
                <Form.Label>{campo.label || campo.nombre}</Form.Label>

                {campo.tipo === "img" ? (
                  <>
                    {value ? (
                      <img
                        src={value}
                        alt={campo.label || campo.nombre}
                        style={{ maxWidth: "100%", maxHeight: "300px", display: "block", marginBottom: "10px" }}
                      />
                    ) : (
                      <p className="text-muted">No hay imagen cargada</p>
                    )}
                    <Form.Control
                      type="text"
                      name={campo.nombre}
                      value={value}
                      onChange={handleChange}
                      placeholder="URL de la imagen"
                    />
                  </>
                ) : campo.tipo === "multi-select" ? (
                  <Form.Control
                    as="select"
                    name={campo.nombre}
                    multiple
                    value={value}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                      setFormState(prev => ({ ...prev, [campo.nombre]: selected }));
                    }}
                  >
                    {campo.opciones?.map(opcion => (
                      <option key={opcion.id || opcion} value={opcion.id || opcion}>
                        {opcion.nombre || opcion}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <Form.Control
                    as={isTextarea ? "textarea" : "input"}
                    type={isTextarea ? undefined : campo.tipo}
                    rows={isTextarea ? 1 : undefined}
                    style={
                      isTextarea
                        ? { minHeight: "70px", resize: "none", overflow: "hidden" }
                        : {}
                    }
                    name={campo.nombre}
                    value={value}
                    onChange={handleChange}
                    placeholder={campo.placeholder || ""}
                    ref={textareaRef}
                  />
                )}
              </Form.Group>
            );
          })}

        </Form>
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
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

export default ModalEditForm;
