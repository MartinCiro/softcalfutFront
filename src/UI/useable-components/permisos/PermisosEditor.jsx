import { Form } from "react-bootstrap";
import React from "react";
import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import { ordenPermisos, iconosPermiso } from "@constants/permissionConfig";
import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import "@styles/Permiso.css";

const PermisosEditor = ({ permisosEditados, setPermisosEditados, permisosActuales }) => {
    const togglePermiso = (entidadNombre, permiso) => {
        if (!permiso) return;
        setPermisosEditados(prev =>
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

    const { query, setQuery, filtered } = useSearch(permisosEditados, "entidad");
    const {
        paginatedData,
        currentPage,
        maxPage,
        nextPage,
        prevPage,
        shouldShowPaginator,
    } = usePagination(filtered, 6);

    const columnas = [
        { key: "entidad", label: "Entidad" },
        {
            key: "permisos",
            label: "Permisos",
            render: (_, row) => {
                const disponibles = permisosActuales.find(p => p.entidad === row.entidad)?.permisos || [];
                return (
                    <div className="d-flex flex-wrap gap-2 justify-content-center modal-editar-permisos">
                        {ordenPermisos
                            .filter(permiso => disponibles.includes(permiso))
                            .map(permiso => (
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
                );
            },
        }
    ];

    return (
        <div>
            <div className="mb-3">
                <SearchInput value={query} onChange={setQuery} placeholder="Buscar por entidad..." title="Permisos" />
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
        </div>
    );
};

export default PermisosEditor;
