import { useState, useMemo } from "react";
import SemanaCalendario from "@componentsUseable/SemanaCalendario";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import TableGeneric from "@componentsUseable/TableGeneric";
import { parseFecha, getCurrentWeekDates } from "@utils/helpers";
import { columnasEventos, camposModal } from "@constants/programacionConfig";

const isSameDate = (a, b) => a.toISOString().split("T")[0] === b.toISOString().split("T")[0];

const CalendarioSemanal = ({ data, config = {}, onEditEvento }) => {
    const [showModal, setShowModal] = useState(false);
    const [eventosDia, setEventosDia] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const eventosSemana = useMemo(() => {
        const semanaActual = getCurrentWeekDates();

        return data.flatMap(competencia =>
            competencia.eventos
                .filter(evento =>
                    semanaActual.some(dia =>
                        isSameDate(parseFecha(evento.fecha), dia)
                    )
                )
                .map(evento => ({
                    ...evento
                }))
        );
    }, [data]);

    const obtenerEventosPorFecha = (fecha) => eventosSemana.filter(evento => isSameDate(parseFecha(evento.fecha), fecha));

    const handleSeleccionFecha = (fecha) => {
        setFechaSeleccionada(fecha);
        setEventosDia(obtenerEventosPorFecha(fecha));
        setShowModal(true);
    };

    const renderCantidadEventos = (fecha) => {
        const cantidad = obtenerEventosPorFecha(fecha).length;
        return cantidad > 0 ? cantidad : null;
    };

    const handleEditEvento = (eventoEditado) => {
        onEditEvento(eventoEditado);
        // Actualizamos los eventos del día para reflejar los cambios
        setEventosDia(prev => prev.map(e => 
            e.id === eventoEditado.id ? eventoEditado : e
        ));
    };

    return (
        <div>
            <SemanaCalendario
                eventos={eventosSemana}
                render={renderCantidadEventos}
                onFechaSeleccionada={handleSeleccionFecha}
                config={config}
            />

            <ModalVerGenerico
                show={showModal}
                onClose={() => setShowModal(false)}
                titulo="Eventos del día"
                campos={camposModal(fechaSeleccionada, eventosDia)}
                datos={{}}
                columnas={{
                    izquierda: ["fechaCompleta"],
                    derecha: ["totalEventos"]
                }}
            >
                <TableGeneric
                    data={eventosDia}
                    columns={columnasEventos}
                    title="Eventos programados"
                    sinDatos="No hay eventos programados para este día"
                    showView={false}
                    showEdit={true}
                    showDelete={false}
                    onEdit={handleEditEvento}
                    
                />
            </ModalVerGenerico>
        </div>
    );
};

export default CalendarioSemanal;