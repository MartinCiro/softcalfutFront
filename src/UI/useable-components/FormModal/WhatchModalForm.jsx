import React from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "@styles/Permiso.css";

const ModalVerGenerico = ({
  show,
  onClose,
  titulo = "Detalle",
  campos = [],
  datos = {},
  children,
  columnas = {
    izquierda: [],
    derecha: []
  },
  accionesAdicionales = null 
}) => {
  if (!datos && !children) return null;

  const renderCampo = (campo) => {
    const valor = campo.render ? campo.render(datos[campo.nombre], datos) : datos[campo.nombre];

    if (campo.tipo === "img" && valor) {
      return (
        <div key={campo.nombre} className="mb-4 text-center">
          <img
            src={valor}
            alt={campo.label || campo.nombre}
            className="img-fluid rounded shadow mx-auto d-block"
          />
        </div>
      );
    }

    const renderValor = () => {
      if (valor === null || valor === undefined) return <span className="text-muted">Sin información</span>;
      if (typeof valor === "object") return JSON.stringify(valor);
      return valor;
    };

    return (
      <div key={campo.nombre} className="campo-ver mb-3">
        <strong>{campo.label || campo.nombre}:</strong>
        <div className="campo-valor">
          {campo.render ? campo.render(valor, datos) : renderValor()}
        </div>
      </div>
    );
  };

  const nombresIzquierda = columnas.izquierda || [];
  const nombresDerecha = (columnas.derecha || []).filter(
    nombre => !nombresIzquierda.includes(nombre)
  );

  const renderContenido = () => {
    if (nombresIzquierda.length > 0 || nombresDerecha.length > 0) {
      return (
        <div className="row">
          <div className="col-md-6">
            {campos
              .filter(campo => nombresIzquierda.includes(campo.nombre))
              .map(renderCampo)}
          </div>
          <div className="col-md-6">
            {campos
              .filter(campo => nombresDerecha.includes(campo.nombre))
              .map(renderCampo)}
          </div>
        </div>
      );
    } else if (campos.length > 0) {
      return (
        <div className="row">
          <div className="col-12">
            {campos.map(renderCampo)}
          </div>
        </div>
      );
    }

    const camposImagen = campos.filter(campo => campo.tipo === "imagen");
    const camposTexto = campos.filter(campo => campo.tipo !== "imagen");

    return (
      <div className="row">
        {camposImagen.length > 0 && (
          <div className="col-12 text-center">
            {camposImagen.map(renderCampo)}
          </div>
        )}
        <div className="col-12 col-md-6">
          {camposTexto.slice(0, Math.ceil(camposTexto.length / 2)).map(renderCampo)}
        </div>
        <div className="col-12 col-md-6">
          {camposTexto.slice(Math.ceil(camposTexto.length / 2)).map(renderCampo)}
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="modal-ver-generico">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="modal-body-custom">
        {renderContenido()}
        {children && <div className="children-container mt-4">{children}</div>}
      </Modal.Body>
      
      <Modal.Footer>
        {accionesAdicionales && (
          <div className="me-auto">
            {accionesAdicionales}
          </div>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalVerGenerico.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  titulo: PropTypes.string,
  campos: PropTypes.arrayOf(PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    label: PropTypes.string,
    tipo: PropTypes.string,
    render: PropTypes.func
  })),
  datos: PropTypes.object,
  children: PropTypes.node,
  columnas: PropTypes.shape({
    izquierda: PropTypes.arrayOf(PropTypes.string),
    derecha: PropTypes.arrayOf(PropTypes.string)
  })
};

export default ModalVerGenerico;