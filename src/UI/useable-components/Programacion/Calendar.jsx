import { useState } from "react";
import SemanaCalendario from "@componentsUseable/SemanaCalendario";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import TableGeneric from "@componentsUseable/TableGeneric";

const CalendarioEventosModal = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const [eventosDia, setEventosDia] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    // Función para convertir fecha "dd/mm/aaaa" a objeto Date
    const parseFecha = (fechaStr) => {
        const [dia, mes, año] = fechaStr.split('/');
        return new Date(año, mes - 1, dia);
    };

    // Función que se ejecuta al seleccionar una fecha
    const handleSeleccionFecha = (fecha) => {
        const fechaSeleccionadaStr = fecha.toISOString().split('T')[0];
        setFechaSeleccionada(fecha);

        // Buscar eventos que coincidan con la fecha seleccionada
        const eventosEnFecha = [];

        data.forEach(competencia => {
            competencia.eventos.forEach(evento => {
                const fechaEvento = parseFecha(evento.fecha);
                if (fechaEvento.toISOString().split('T')[0] === fechaSeleccionadaStr) {
                    eventosEnFecha.push({
                        ...evento,
                        competencia: competencia.categoria,
                        id: `${competencia.categoria}-${evento.local}-${evento.visitante}`
                    });
                }
            });
        });

        setEventosDia(eventosEnFecha);
        setShowModal(true);
    };

    // Render para mostrar la cantidad de eventos en cada día
    const renderCantidadEventos = (fecha) => {
        const fechaStr = fecha.toISOString().split('T')[0];
        let cantidad = 0;

        data.forEach(competencia => {
            competencia.eventos.forEach(evento => {
                const fechaEvento = parseFecha(evento.fecha);
                if (fechaEvento.toISOString().split('T')[0] === fechaStr) {
                    cantidad++;
                }
            });
        });

        return cantidad > 0 ? cantidad : null;
    };

    // Columnas para la tabla de eventos
    const columnasEventos = [
        { key: "categoria", label: "Categoria" },
        { key: "local", label: "Local" },
        { key: "visitante", label: "Visitante" },
        { key: "hora", label: "Hora" },
        { key: "lugar", label: "Lugar" },
        { key: "rama", label: "Rama" }
    ];

    // Campos para el modal (información de la fecha)
    const camposModal = [
        {
            nombre: "fechaCompleta",
            label: "Fecha",
            render: () => fechaSeleccionada?.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        },
        {
            nombre: "totalEventos",
            label: "Total de eventos",
            render: () => eventosDia.length
        }
    ];

    return (
        <div>
            <SemanaCalendario
                data={data}
                render={renderCantidadEventos}
                onFechaSeleccionada={handleSeleccionFecha}
            />

            {/* Modal con los eventos del día */}
            <ModalVerGenerico
                show={showModal}
                onClose={() => setShowModal(false)}
                titulo="Eventos del día"
                campos={camposModal}
                datos={{}}
                columnas={{
                    izquierda: ["fechaCompleta"],
                    derecha: ["totalEventos"]
                }}
            >
                <TableGeneric
                    data={eventosDia}
                    columns={columnasEventos}
                    title="Partidos programados"
                    sinDatos="No hay eventos programados para este día"
                    showView={false}
                    showEdit={false}
                    showDelete={false}
                />
            </ModalVerGenerico>
        </div>
    );
};

export default CalendarioEventosModal;