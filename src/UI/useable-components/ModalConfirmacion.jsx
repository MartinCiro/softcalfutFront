import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalConfirmacion = ({ show, mensaje, onConfirm, onClose }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirmar acción</Modal.Title>
    </Modal.Header>
    <Modal.Body>{mensaje}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancelar</Button>
      <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
    </Modal.Footer>
  </Modal>
);

export default ModalConfirmacion;
