import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";

import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";

import { iconosPermiso, ordenPermisos } from "@constants/permissionConfig";
import "@styles/Permiso.css";

const ModalCreateRol = ({
    show,
    onClose,
    campos,
    titulo = "Crear Rol",
    permisosActuales = [],
    onSubmit,
}) => {
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
    const sinPermisos = campos.filter(campo => campo.nombre !== "permisos");
    const [formValues, setFormValues] = useState({
        nombre: "",
        descripcion: "",
    });


    useEffect(() => {
        if (permisosActuales.length > 0) {
            const permisosIniciales = permisosActuales.map(actual => ({
                entidad: actual.entidad,
                permisos: [],
            }));
            setPermisosSeleccionados(permisosIniciales);
        }
    }, [permisosActuales]);

    const togglePermiso = (entidadNombre, permiso) => {
        if (!permiso) return;
        setPermisosSeleccionados(prev =>
            prev.map(entidad => {
                if (entidad.entidad !== entidadNombre) return entidad;
                const tienePermiso = entidad.permisos.includes(permiso);
                const nuevosPermisos = tienePermiso
                    ? entidad.permisos.filter(p => p !== permiso)
                    : [...entidad.permisos, permiso];

                return {
                    ...entidad,
                    permisos: nuevosPermisos,
                };
            })
        );
    };

    const columnas = [
        { key: "entidad", label: "Entidad" },
        {
            key: "permisos",
            label: "Permisos",
            render: (_, row) => {
                const permisosDisponibles = permisosActuales.find(p => p.entidad === row.entidad)?.permisos || [];

                return (
                    <div className="d-flex flex-wrap gap-2 justify-content-center modal-editar-permisos">
                        {ordenPermisos
                            .filter(permiso => permisosDisponibles.includes(permiso))
                            .map(permiso => (
                                <div key={permiso} className="d-flex flex-column align-items-center permiso-item" title={permiso}>
                                    {iconosPermiso[permiso] || permiso}
                                    <Form.Check
                                        type="checkbox"
                                        id={`perm-${row.entidad}-${permiso}`}
                                        checked={
                                            permisosSeleccionados.find(e => e.entidad === row.entidad)?.permisos.includes(permiso) || false
                                        }
                                        label=""
                                        onChange={() => togglePermiso(row.entidad, permiso)}
                                    />
                                </div>
                            ))}
                    </div>
                );
            }
        },
    ];

    const { query, setQuery, filtered } = useSearch(permisosSeleccionados, "entidad");

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

    const handleGuardar = () => {
        const permisosFiltrados = permisosSeleccionados.filter(ent => ent.permisos.length > 0);
        onSubmit({
            ...formValues,
            permisos: permisosFiltrados,
        });
    };

    return (
        <CreateModalFormulario
            campos={sinPermisos}
            datos={formValues}
            show={show}
            onClose={onClose}
            titulo={titulo}
            onChange={handleFormChange}
            onSubmit={handleGuardar}
        >
            <div>
                {permisosSeleccionados.length === 0 ? (
                    <p className="text-muted text-center">No hay permisos disponibles para este rol.</p>
                ) : (
                    <>
                        <div className="mb-3">
                            <SearchInput
                                value={query}
                                onChange={setQuery}
                                placeholder="Buscar por entidad..."
                                title="Permisos"
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
        </CreateModalFormulario>
    );
};

export default ModalCreateRol;
