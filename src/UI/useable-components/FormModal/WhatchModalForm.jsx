import React from "react";
import { Modal, Button } from "react-bootstrap";
import "@styles/Permiso.css"; // Styles

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
  }
}) => {
  if (!datos && !children) return null;

  // Función para renderizar un campo
  const renderCampo = (campo) => {
    const valor = campo.render ? campo.render(datos[campo.nombre], datos) : datos[campo.nombre];

    if (campo.tipo === "imagen" && valor) {
      return (
        <div key={campo.nombre} className="mb-4 text-center">
          <img
            src={valor}
            alt={campo.label || campo.nombre}
            className="img-fluid rounded shadow"
            style={{
              maxHeight: "300px",
              objectFit: "cover",
              border: "2px solid #141414"
            }}
          />
        </div>
      );
    }

    return (
      <div
        key={campo.nombre}
        className="mb-3"
        style={{
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "10px"
        }}
      >
        <strong>{campo.label || campo.nombre}:</strong>
        <div
          style={{
            marginTop: "5px",
            color: "#141414",
            whiteSpace: "pre-wrap"
          }}
        >
          {campo.render
            ? campo.render(valor, datos)
            : valor === null || valor === undefined
              ? <span style={{ color: "#6c757d" }}>Sin información</span>
              : typeof valor === "object"
                ? JSON.stringify(valor)
                : valor}
        </div>
      </div>
    );
  };

  // Eliminar duplicados si un campo está en ambas columnas
  const nombresIzquierda = columnas.izquierda;
  const nombresDerecha = columnas.derecha.filter(nombre => !nombresIzquierda.includes(nombre));

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
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
        {(nombresIzquierda.length > 0 || nombresDerecha.length > 0) ? (
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
        ) : (
          // Caso por defecto: dividir horizontal y móvil vertical
          (() => {
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
                  {camposTexto
                    .slice(0, Math.ceil(camposTexto.length / 2))
                    .map(renderCampo)}
                </div>
                <div className="col-12 col-md-6">
                  {camposTexto
                    .slice(Math.ceil(camposTexto.length / 2))
                    .map(renderCampo)}
                </div>
              </div>
            );
          })()
        )}

        {/* Sección para children (si existe) */}
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
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVerGenerico;