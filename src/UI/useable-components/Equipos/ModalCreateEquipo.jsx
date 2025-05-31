import React, { useState, useMemo } from "react";
import { Form } from "react-bootstrap";

import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";

import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import EmptyMessage from "@componentsUseable/EmptyMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import SelectSearch from "@componentsUseable/SelectSearch";

const ModalCreateEquipo = ({
    show,
    onClose,
    campos,
    titulo = "Crear Equipo",
    usuarios = [],
    categorias = [],
    onSubmit,
}) => {
    const [formValues, setFormValues] = useState({
        nombre: "",
        descripcion: "",
    });

    const camposFiltrados = campos.filter(
        (campo) => campo.nombre !== "documento_representante" &&
            campo.nombre !== "estado_representante" &&
            campo.nombre !== "nombre_representante" &&
            campo.nombre !== "categoria"
    );

    const [encargado, setEncargado] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);

    const jugadoresDisponibles = useMemo(
        () => usuarios.filter(u => u.rol === "Jugador" || u.rol === "AdminJugador"),
        [usuarios]
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

    const handleFormChange = (campo, valor) => {
        setFormValues(prev => ({ ...prev, [campo]: valor }));
    };

    const toggleJugador = jugador => {
        setJugadoresSeleccionados(prev =>
            prev.some(j => j.documento === jugador.documento)
                ? prev.filter(j => j.documento !== jugador.documento)
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
                    checked={jugadoresSeleccionados.some(j => j.documento === row.documento)}
                    onChange={() => toggleJugador(row)}
                />
            ),
        },
    ];

    const handleGuardar = () => {
        onSubmit({
            nom_equipo: formValues.nom_equipo.trim(),
            encargado: encargado?.documento ?? null,
            categoria: categoria.nombre_categoria,
            jugadores: jugadoresSeleccionados.map(j => j.documento),
        });
        onClose();
    };


    return (
        <CreateModalFormulario
            campos={camposFiltrados}
            datos={formValues}
            show={show}
            onClose={onClose}
            titulo={titulo}
            onChange={handleFormChange}
            onSubmit={handleGuardar}
        >
            <div className="mb-4 mt-3 w-100">
                <SelectSearch
                    label="Categoría"
                    options={categorias}
                    value={categoria}
                    onChange={setCategoria}
                    getOptionValue={(c) => (c ? c.nombre_categoria : "")}
                    getOptionLabel={(c) => `${c.nombre_categoria}`}
                    searchPlaceholder="Buscar por categoría..."
                    defaultNoFilter="No se ha encontrado categorias."
                    placeholder="Seleccione una categoría"
                    filterKeys={["nombres"]}
                />
            </div>
            <div className="mb-4 mt-3 w-100">
                <SelectSearch
                    label="Encargado del equipo"
                    options={jugadoresDisponibles}
                    value={encargado}
                    onChange={setEncargado}
                    getOptionValue={(u) => u ? u.documento : ""}
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
                            sinDatos={"No se encontraron jugadores."}
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
        </CreateModalFormulario>
    );
};

export default ModalCreateEquipo;
