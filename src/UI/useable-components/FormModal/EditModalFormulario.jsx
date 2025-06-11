import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useErrorHandler from "@hooks/useErrorHandler";
import { useAutoResizeTextarea } from "@hooks/useAutoResizeTextarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseFecha } from "@utils/helpers";

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
    const claves = Object.keys(datos);
    const hayCambio = claves.some(k => formState[k] !== datos[k]);
    if (hayCambio) {
      setFormState(datos || {});
      setMensajeExito(null);
      resetError();
    }
  }, [datos, show]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let finalValue = value;

    // Si es un campo de fecha, convertimos a formato ISO
    if (type === "date" && value) {
      finalValue = new Date(value).toISOString();
    }

    if (onChange) onChange(name, finalValue);
    setFormState((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    try {
      setGuardando(true);
      const camposBloqueados = campos
        .filter(campo => campo.bloqueado)
        .map(campo => campo.nombre);

      const formStateFiltrado = Object.fromEntries(
        Object.entries(formState).filter(([key]) => !camposBloqueados.includes(key))
      );

      await onSubmit(formStateFiltrado);
      setMensajeExito("Actualizado correctamente");
    } catch (err) {
      handleError(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="editModal">
      <Modal.Header
        closeButton
      >
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensajeExito && (
          <Alert
            variant="success"
            className="text-center"
            style={{ backgroundColor: "#07852E", color: "#F5F5F5" }}
          >
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
            const textareaRef = useAutoResizeTextarea(isTextarea ? value : "");

            return (
              <Form.Group key={campo.nombre} className="mb-3">
                <Form.Label>
                  {campo.label || campo.nombre}
                </Form.Label>

                {campo.tipo === "img" ? (
                  <>
                    {value ? (
                      <img
                        src={value}
                        alt={campo.label || campo.nombre}
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
                      style={{
                        borderColor: "#141414",
                        backgroundColor: "#F5F5F5"
                      }}
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
                      handleChange({ target: { name: campo.nombre, value: selected } });
                    }}
                    style={{
                      borderColor: "#141414",
                      backgroundColor: "#F5F5F5"
                    }}
                  >
                    {campo.opciones?.map(opcion => (
                      <option key={opcion.id || opcion} value={opcion.id || opcion}>
                        {opcion.nombre || opcion}
                      </option>
                    ))}
                  </Form.Control>
                ) : campo.tipo === "select" ? (
                  <Form.Control
                    as="select"
                    name={campo.nombre}
                    value={value}
                    onChange={handleChange}
                    disabled={campo.bloqueado || false}
                    className="edit-modal-select-input"
                  >
                    {campo.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                ) : campo.tipo === "date" ? (
                  <DatePicker
                    selected={value ? parseFecha(value) : null}
                    onChange={(date) => handleChange({
                      target: {
                        name: campo.nombre,
                        value: date ? date.toISOString() : '',
                        type: 'date'
                      }
                    })}
                    maxDate={campo.fechaMaxima ? new Date() : undefined}
                    className="form-control"
                    disabled={campo.bloqueado}
                    dateFormat="dd/MM/yyyy"
                  />
                ) : (
                  <Form.Control
                    as={isTextarea ? "textarea" : "input"}
                    type={isTextarea ? undefined : campo.tipo}
                    rows={isTextarea ? 1 : undefined}
                    style={{
                      ...(isTextarea ? {
                        minHeight: "70px",
                        resize: "none",
                        overflow: "hidden"
                      } : {})
                    }}
                    name={campo.nombre}
                    value={value}
                    onChange={handleChange}
                    placeholder={campo.placeholder || ""}
                    ref={textareaRef}
                    disabled={campo.bloqueado || false}
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
        <Button
          variant="secondary"
          onClick={onClose}
        >
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