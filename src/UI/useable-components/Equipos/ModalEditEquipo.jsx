import React, { useState, useMemo, useEffect } from "react";
import { Form } from "react-bootstrap";

import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";

import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import EmptyMessage from "@componentsUseable/EmptyMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import SelectSearch from "@componentsUseable/SelectSearch";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";

const ModalEditEquipo = ({
    show,
    onClose,
    campos,
    titulo = "Editar Equipo",
    usuarios = [],
    datos = {},
    onSubmit,
    loading,
}) => {
    const camposFiltrados = campos.filter(
        (campo) =>
            campo.nombre !== "documento_representante" &&
            campo.nombre !== "estado_representante" &&
            campo.nombre !== "nombre_representante"
    );

    const jugadoresDisponibles = useMemo(
        () => usuarios.filter((u) => u.rol === "Jugador" || u.rol === "AdminJugador"),
        [usuarios]
    );

    const [encargado, setEncargado] = useState(() =>
        jugadoresDisponibles.find((u) => u.documento === datos.encargado) || null
    );

    const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState(() =>
        jugadoresDisponibles.filter((u) => datos.jugadores?.includes(u.documento))
    );

    const { query, setQuery, filtered } = useSearch(jugadoresDisponibles, "nombres");

    const {
        paginatedData,
        currentPage,
        maxPage,
        nextPage,
        prevPage,
        shouldShowPaginator,
    } = usePagination(filtered, 6);

    const toggleJugador = (jugador) => {
        setJugadoresSeleccionados((prev) =>
            prev.some((j) => j.documento === jugador.documento)
                ? prev.filter((j) => j.documento !== jugador.documento)
                : [...prev, jugador]
        );
    };

    const columnas = [
        { key: "nombres", label: "Nombre" },
        { key: "documento", label: "Documento" },
        {
            key: "seleccionado",
            label: "Seleccionar",
            render: (_, row) => (
                <Form.Check
                    type="checkbox"
                    checked={jugadoresSeleccionados.some((j) => j.documento === row.documento)}
                    onChange={() => toggleJugador(row)}
                />
            ),
        },
    ];

    const handleGuardar = async (formStateFiltrado) => {
        await onSubmit({
            ...formStateFiltrado,
            encargado: encargado?.documento ?? null,
            jugadores: jugadoresSeleccionados.map((j) => j.documento),
        });
        onClose();
    };

    return (
        <ModalEditForm
            show={show}
            onClose={onClose}
            titulo={titulo}
            campos={camposFiltrados}
            datos={datos}
            onSubmit={handleGuardar}
            loading={loading}
        >
            <div className="mb-4 mt-3 w-100">
                <SelectSearch
                    label="Encargado del equipo"
                    options={jugadoresDisponibles}
                    value={encargado}
                    onChange={setEncargado}
                    getOptionValue={(u) => (u ? u.documento : "")}
                    getOptionLabel={(u) => `${u.nombres} (${u.rol})`}
                    searchPlaceholder="Buscar por nombre o cédula..."
                    filterKeys={["nombres", "cedula"]}
                />
            </div>

            {encargado && (
                <div className="mt-3">
                    <strong>Representante seleccionado:</strong>
                    <div>Nombre: {encargado.nombres}</div>
                    <div>Documento: {encargado.documento}</div>
                </div>
            )}

            <div>
                <h5>Seleccionar jugadores</h5>
                {jugadoresDisponibles.length === 0 ? (
                    <EmptyMessage mensaje="No hay jugadores disponibles." />
                ) : (
                    <>
                        <div className="mb-3">
                            <SearchInput
                                value={query}
                                onChange={setQuery}
                                placeholder="Buscar por nombre..."
                                title="Jugadores"
                            />
                        </div>

                        <TableGeneric
                            data={paginatedData}
                            columns={columnas}
                            showEdit={false}
                            showView={false}
                            showDelete={false}
                        />

                        {shouldShowPaginator && (
                            <Paginator
                                currentPage={currentPage}
                                maxPage={maxPage}
                                nextPage={nextPage}
                                prevPage={prevPage}
                            />
                        )}
                    </>
                )}
            </div>
        </ModalEditForm>
    );
};

export default ModalEditEquipo;