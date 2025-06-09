import { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { getCurrentWeekDates } from "@utils/helpers";
import "@styles/SemanaCalendario.css"; // Styles

const diasLetras = ["D", "L", "M", "X", "J", "V", "S"];

const SemanaCalendario = ({ 
    eventos = [], 
    render = () => null, 
    onFechaSeleccionada,
    config = {}
}) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const semanaActual = getCurrentWeekDates(config.empezarEnLunes);

    const handleClickFecha = (fecha) => {
        setFechaSeleccionada(fecha);
        onFechaSeleccionada && onFechaSeleccionada(fecha);
    };

    return (
        <Container className="py-3">
            <Row className="g-2 text-center">
                {semanaActual.map((fecha, index) => {
                    const hoy = new Date();
                    const esHoy = fecha.getDate() === hoy.getDate() && 
                                  fecha.getMonth() === hoy.getMonth() && 
                                  fecha.getFullYear() === hoy.getFullYear();
                    
                    return (
                        <Col key={index} className="calendar">
                            <Button
                                variant={esHoy ? "primary" : "outline-secondary"}
                                className="w-100 py-2 d-flex flex-column align-items-center"
                                onClick={() => handleClickFecha(fecha)}
                            >
                                <small className="text-muted">
                                    {diasLetras[fecha.getDay()]}
                                </small>
                                <span className="fs-5">{fecha.getDate()}</span>
                                <small className="text-primary mt-1">
                                    {render(fecha)}
                                </small>
                            </Button>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default SemanaCalendario;