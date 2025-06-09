import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useErrorHandler from "@hooks/useErrorHandler";
import { useAutoResizeTextarea } from "@hooks/useAutoResizeTextarea";

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

  useEffect(() => {
    if (datos && Object.keys(datos).length > 0) {
      setFormState(datos);
    } else {
      // Inicializar con valores por defecto si existen
      const initialState = {};
      campos.forEach(campo => {
        if (campo.defaultValue !== undefined) {
          initialState[campo.nombre] = campo.defaultValue;
        }
      });
      setFormState(initialState);
    }
  }, [datos, show]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (typeof onChange === "function") onChange(name, value);
  };

  const handleDateChange = (date, name) => {
    const value = date ? date.toISOString() : '';
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (typeof onChange === "function") onChange(name, value);
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    try {
      setGuardando(true);
      resetError();
      await onSubmit(formState);
      setMensajeExito("Creado correctamente");
    } catch (err) {
      handleError(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleClose = () => {
    onClose();
    setMensajeExito(null);
    resetError();
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="editModal">
      <Modal.Header 
        closeButton
        style={{ 
          backgroundColor: "#141414",
          color: "#F5F5F5",
          borderBottom: "3px solid #F4D609"
        }}
      >
        <Modal.Title style={{ fontWeight: "bold" }}>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#F5F5F5", padding: "20px" }}>
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
          <div className="row">
            {campos.map((campo) => {
              const isTextarea = campo.tipo === "textarea";
              const value = formState[campo.nombre] || "";
              const textareaRef = useAutoResizeTextarea(isTextarea ? value : "");

              return (
                <div key={campo.nombre} className={`mb-3 ${campo.columna === 'derecha' ? 'col-md-6' : 'col-md-6'}`}>
                  <Form.Group>
                    <Form.Label style={{ color: "#07852E", fontWeight: "bold" }}>
                      {campo.label || campo.nombre}
                      {campo.requerido && <span className="text-danger"> *</span>}
                    </Form.Label>

                    {campo.tipo === "img" ? (
                      <>
                        {value && (
                          <img
                            src={value}
                            alt={`Vista previa ${campo.label}`}
                            className="img-fluid rounded mb-2"
                            style={{ 
                              maxHeight: "150px",
                              border: "2px solid #141414"
                            }}
                          />
                        )}
                        <Form.Control
                          type="text"
                          name={campo.nombre}
                          value={value}
                          onChange={handleChange}
                          placeholder={campo.placeholder || "URL de la imagen"}
                          style={{ 
                            borderColor: "#141414",
                            backgroundColor: "#FFFFFF"
                          }}
                          required={campo.requerido}
                        />
                      </>
                    ) : campo.tipo === "select" ? (
                      <Form.Control
                        as="select"
                        name={campo.nombre}
                        value={value}
                        onChange={handleChange}
                        style={{ 
                          borderColor: "#141414",
                          backgroundColor: "#FFFFFF"
                        }}
                        required={campo.requerido}
                      >
                        <option value="">Seleccione...</option>
                        {campo.opciones?.map(opcion => (
                          <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                          </option>
                        ))}
                      </Form.Control>
                    ) : campo.tipo === "date" ? (
                      <DatePicker
                        selected={parseDate(value)}
                        onChange={(date) => handleDateChange(date, campo.nombre)}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        maxDate={campo.fechaMaxima === 'hoy' ? new Date() : undefined}
                        placeholderText={campo.placeholder || "Seleccione una fecha"}
                        showYearDropdown
                        dropdownMode="select"
                        style={{ 
                          borderColor: "#141414",
                          backgroundColor: "#FFFFFF"
                        }}
                        required={campo.requerido}
                      />
                    ) : (
                      <Form.Control
                        as={isTextarea ? "textarea" : "input"}
                        type={isTextarea ? undefined : campo.tipo}
                        rows={isTextarea ? 3 : undefined}
                        style={{
                          ...(isTextarea ? { 
                            minHeight: "100px", 
                            resize: "vertical", 
                            overflow: "hidden" 
                          } : {}),
                          borderColor: "#141414",
                          backgroundColor: "#FFFFFF"
                        }}
                        name={campo.nombre}
                        value={value}
                        onChange={handleChange}
                        placeholder={campo.placeholder || ""}
                        ref={textareaRef}
                        required={campo.requerido}
                      />
                    )}
                  </Form.Group>
                </div>
              );
            })}
          </div>
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleClose}
        >
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