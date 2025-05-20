import React, { useState, useEffect } from "react";
import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import ModalEditarGenerico from "@componentsUseable/FormModal/EditModalFormulario";
import { Form } from "react-bootstrap";
import { iconosPermiso, ordenPermisos } from "@constants/permissionConfig";
import "@styles/Permiso.css";
import useFetchData from "@hooks/useFetchData";
import PermisoService from "@services/PermisoService";
import LoadingSpinner from "@componentsUseable/Loading";

const ModalEditarPermisos = ({ show, onClose, campos, titulo = "Editar Rol", datos = {}, onSubmit }) => {
    const { data: permisosActuales = [], loading } = useFetchData(PermisoService.permisos);
    const sinPermisos = campos.filter(campo => campo.nombre !== "permisos");
    const [formValues, setFormValues] = useState({
        nombre: datos.nombre || "",
        descripcion: datos.descripcion || "",
    });
    const [permisosEditados, setPermisosEditados] = useState([]);
    const generarPermisosCompletos = () => {
        return permisosActuales.map(actual => {
            const permisosEncontrados = datos.permisos?.[actual.entidad] || [];
            return {
                entidad: actual.entidad,
                permisos: actual.permisos.filter(p => permisosEncontrados.includes(p)),
            };
        });
    };

    useEffect(() => {
        if (permisosActuales.length > 0) setPermisosEditados(generarPermisosCompletos());
    }, [datos, permisosActuales]);

    useEffect(() => {
        setFormValues({
            nombre: datos.nombre || "",
            descripcion: datos.descripcion || "",
        });
    }, [datos]);
    const { query, setQuery, filtered } = useSearch(permisosEditados, "entidad");

    const {
        paginatedData,
        currentPage,
        maxPage,
        nextPage,
        prevPage,
        shouldShowPaginator,
    } = usePagination(filtered, 6);

    const togglePermiso = (entidadNombre, permiso) => {
        if (!permiso) return;
        setPermisosEditados((prev) =>
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

    const columnasEditable = [
        { key: "entidad", label: "Entidad" },
        {
            key: "permisos",
            label: "Permisos",
            render: (_, row) => (
                <div className="d-flex flex-wrap gap-2 justify-content-center modal-editar-permisos">
                    {ordenPermisos.map((permiso) => (
                        <div key={permiso} className="d-flex flex-column align-items-center permiso-item" title={permiso}>
                            {iconosPermiso[permiso] || permiso}
                            <Form.Check
                                type="checkbox"
                                id={`perm-${row.entidad}-${permiso}`}
                                checked={row.permisos.includes(permiso)}
                                label=""
                                onChange={() => togglePermiso(row.entidad, permiso)}
                            />
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    const handleFormChange = (campo, valor) => {
        setFormValues(prev => ({ ...prev, [campo]: valor }));
    };

    const handleGuardar = () => {
        const permisosFiltrados = permisosEditados.filter(ent => ent.permisos.length > 0);
        onSubmit({
            ...formValues,
            permisos: permisosFiltrados,
        });
    };

    if (loading) return <LoadingSpinner />;
    return (
        <ModalEditarGenerico
            campos={sinPermisos}
            datos={formValues}
            show={show}
            onClose={onClose}
            titulo={titulo}
            onChange={handleFormChange}
            onSubmit={handleGuardar}>
            <div>
                {permisosEditados.length === 0 ? (
                    <p className="text-muted text-center">Este rol no tiene permisos asignados.</p>
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
                            columns={columnasEditable}
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
        </ModalEditarGenerico>
    );
};

export default ModalEditarPermisos;