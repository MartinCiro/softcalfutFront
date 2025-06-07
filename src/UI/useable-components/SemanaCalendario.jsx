import { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import TableGeneric from "./TableGeneric"; // Asegúrate de importar tu componente de tabla

const diasLetras = ["D", "L", "M", "X", "J", "V", "S"];

const SemanaCalendario = ({
  data,
  children,
  render = () => null,
  opt = { mostrarModal: true, empezarEnLunes: false },
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [diasConEventos, setDiasConEventos] = useState([]);
  const [eventosDelDia, setEventosDelDia] = useState([]);

  // Extraer y formatear las fechas únicas de los eventos
  useEffect(() => {
    if (!data) return;

    const fechasUnicas = new Set();
    const eventosPorFecha = {};

    data.forEach(competencia => {
      competencia.eventos.forEach(evento => {
        // Convertir fecha de "dd/mm/aaaa" a objeto Date
        const [dia, mes, año] = evento.fecha.split('/');
        const fecha = new Date(año, mes - 1, dia);
        
        fechasUnicas.add(fecha.getTime()); // Usamos getTime() para comparación
        const fechaKey = fecha.toISOString().split('T')[0];

        if (!eventosPorFecha[fechaKey]) {
          eventosPorFecha[fechaKey] = [];
        }
        eventosPorFecha[fechaKey].push({
          ...evento,
          competencia: competencia.competencia
        });
      });
    });

    // Convertir timestamps a fechas y ordenar
    const fechasOrdenadas = Array.from(fechasUnicas)
      .map(time => new Date(time))
      .sort((a, b) => a - b);

    setDiasConEventos(fechasOrdenadas);
  }, [data]);

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
    
    // Buscar eventos para esta fecha
    const fechaKey = fecha.toISOString().split('T')[0];
    const eventos = [];
    
    data.forEach(competencia => {
      competencia.eventos.forEach(evento => {
        const [dia, mes, año] = evento.fecha.split('/');
        const fechaEvento = new Date(año, mes - 1, dia);
        if (fechaEvento.toISOString().split('T')[0] === fechaKey) {
          eventos.push({
            ...evento,
            competencia: competencia.categoria,
            id: `${competencia.competencia}-${evento.local}-${evento.visitante}`
          });
        }
      });
    });

    setEventosDelDia(eventos);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Columnas para la tabla de eventos
  const columnasEventos = [
    { key: "categoria", label: "Categoria" },
    { key: "local", label: "Local" },
    { key: "visitante", label: "Visitante" },
    { key: "hora", label: "Hora" },
    { key: "lugar", label: "Lugar" },
    { key: "rama", label: "Rama" }
  ];

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
      nombre: "totalEventos",
      label: "Total de partidos",
      render: () => eventosDelDia.length
    }
  ];

  return (
    <Container className="py-3">
      {/* Calendario de días */}
      <Row className="g-2 text-center">
        {diasConEventos.map((fecha, index) => {
          const fechaKey = fecha.toISOString().split('T')[0];
          const hoy = new Date();
          const esHoy = fecha.getDate() === hoy.getDate() && 
                        fecha.getMonth() === hoy.getMonth() && 
                        fecha.getFullYear() === hoy.getFullYear();
          
          return (
            <Col key={index}>
              <Button
                variant={esHoy ? "primary" : "outline-secondary"}
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
          );
        })}
      </Row>

      {/* Modal con tabla de eventos */}
      <ModalVerGenerico
        show={showModal}
        onClose={handleCloseModal}
        titulo="Partidos del día"
        campos={camposModal}
        datos={{}}
      >
        <TableGeneric
          data={eventosDelDia}
          columns={columnasEventos}
          showView={false}
          showEdit={false}
          showDelete={false}
          sinDatos="No hay partidos programados para este día"
        />
      </ModalVerGenerico>

      {children && <div className="mt-3">{children}</div>}
    </Container>
  );
};

export default SemanaCalendario;