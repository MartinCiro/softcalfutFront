import React from "react";
import useSearch from "@hooks/useSearch";
import { MDBIcon } from "mdb-react-ui-kit";
import usePagination from "@hooks/usePagination";
import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import {
  dataFormated,
} from "@utils/helpers";

// Iconos para cada tipo de permiso
const iconosPermiso = {
    Lee: <MDBIcon icon="eye" />,
    Edita: <MDBIcon icon="edit" />,
    Elimina: <MDBIcon icon="trash" />,
    Crea: <MDBIcon icon="plus" />,
    Actualiza: <MDBIcon icon="refresh" />,
    Asigna: <MDBIcon icon="users" />,
    LeeProfile: <MDBIcon icon="eye" />,
};

const ordenPermisos = ['Lee', 'Crea', 'Actualiza', 'Elimina', 'Asigna', 'LeeProfile'];
// Columnas para la tabla de permisos
const columnasPermisos = [
    { key: "entidad", label: "Entidad" },
    {
        key: "permisos",
        label: "Permisos",
        render: (permisos) => {
            const permisosOrdenados = [...permisos].sort((a, b) => {
                const indexA = ordenPermisos.indexOf(a);
                const indexB = ordenPermisos.indexOf(b);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });

            return permisosOrdenados.map((permiso, i) => (
                <span key={i} className="me-2" title={permiso}>
                    {iconosPermiso[permiso] || permiso}
                </span>
            ));
        },
    },
];

// Componente principal del modal
const ModalVerPermisos = ({ show, onClose, titulo = "Permisos", datos = {} }) => {
  const dataPermisos = dataFormated(datos.permisos);
  
  // Hook de búsqueda por entidad
  const { query, setQuery, filtered } = useSearch(dataPermisos, "entidad");
  const {
    paginatedData,
    currentPage,
    maxPage,
    nextPage,
    prevPage,
    shouldShowPaginator,
  } = usePagination(filtered, 6); 

  return (
    <ModalVerGenerico show={show} onClose={onClose} titulo={titulo}>
      <div>
        {dataPermisos.length === 0 ? (
          <p className="text-muted text-center">Este rol no tiene permisos asignados.</p>
        ) : (
          <>
            <div className="mb-3">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Buscar por entidad..."
              />
            </div>

            <TableGeneric
              data={paginatedData}
              columns={columnasPermisos}
              showEdit={false}
              showView={false}
              showDelete={false}
              title=""
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
    </ModalVerGenerico>
  );
};

export default ModalVerPermisos;