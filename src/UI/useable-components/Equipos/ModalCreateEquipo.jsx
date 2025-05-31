import React from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useFormModal } from "@hooks/forms/useFormModal";
import ModalFormInput from "@componentsUseable/FormModal/ModalFormInput";
import "@styles/EditGeneric.css";

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
  const {
    formState,
    guardando,
    mensajeExito,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormModal({ datos, campos, onChange });

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleInternalSubmit = () => {
    handleSubmit(onSubmit);
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
            {campos.map((campo) => (
              <div key={campo.nombre} className={`mb-3 ${campo.columna === 'derecha' ? 'col-md-6' : 'col-md-6'}`}>
                <Form.Group>
                  <Form.Label style={{ color: "#07852E", fontWeight: "bold" }}>
                    {campo.label || campo.nombre}
                    {campo.requerido && <span className="text-danger"> *</span>}
                  </Form.Label>
                  <ModalFormInput 
                    campo={campo} 
                    value={formState[campo.nombre] || ""} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </div>
            ))}
          </div>
          {children}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleInternalSubmit}
          disabled={guardando || externalLoading}
        >
          {guardando || externalLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModalFormulario;