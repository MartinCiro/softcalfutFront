import { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";

const diasLetras = ["D", "L", "M", "X", "J", "V", "S"];

const obtenerProximosDias = () => {
  const hoy = new Date();
  const diaActual = hoy.getDay();
  const diasRestantesSemana = 6 - diaActual;
  
  return Array.from({ length: diasRestantesSemana + 1 }).map((_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    return fecha;
  });
};

const SemanaCalendario = ({
  children,
  render = () => null,
  opt = { mostrarModal: true, empezarEnLunes: false },
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dias = opt.empezarEnLunes ? obtenerDiasSemanaCompleta() : obtenerProximosDias();

  function obtenerDiasSemanaCompleta() {
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - diaActual + (diaActual === 0 ? 0 : 1));
    
    return Array.from({ length: 7 }).map((_, i) => {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      return fecha;
    });
  }

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
    if (opt.mostrarModal) setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Configuración para el ModalVerGenerico
  const camposModal = [
    {
      nombre: "fechaCompleta",
      label: "Fecha completa",
      render: () => fechaSeleccionada?.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    },
    {
      nombre: "diaSemana",
      label: "Día de la semana",
      render: () => fechaSeleccionada?.toLocaleDateString("es-ES", { weekday: "long" })
    },
    {
      nombre: "fechaCorta",
      label: "Fecha",
      render: () => fechaSeleccionada?.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  ];

  return (
    <Container className="py-3">
      {/* Calendario de días */}
      <Row className="g-2 text-center">
        {dias.map((fecha, index) => (
          <Col key={index}>
            <Button
              variant={
                fecha.getDate() === new Date().getDate() && 
                fecha.getMonth() === new Date().getMonth()
                  ? "primary"
                  : "outline-secondary"
              }
              className="w-100 py-2 d-flex flex-column align-items-center"
              onClick={() => handleFechaSeleccionada(fecha)}
            >
              <small className="text-muted">{diasLetras[fecha.getDay()]}</small>
              <span className="fs-5">{fecha.getDate()}</span>
              <small className="text-primary mt-1">
                {render(fecha)}
              </small>
            </Button>
          </Col>
        ))}
      </Row>

      {/* Modal genérico reutilizado */}
      <ModalVerGenerico
        show={showModal}
        onClose={handleCloseModal}
        titulo="Detalle de fecha"
        campos={camposModal}
        datos={{}} // No necesitamos datos adicionales aquí
      />

      {/* Children opcional */}
      {children && <div className="mt-3">{children}</div>}
    </Container>
  );
};

export default SemanaCalendario;