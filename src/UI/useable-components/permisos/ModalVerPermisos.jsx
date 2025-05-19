import React from "react";
import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import { dataFormated } from "@utils/helpers";
import { columnasPermisosGenericas } from "@constants/permissionConfig";

// Componente principal del modal
const ModalVerPermisos = ({ show, onClose, campos = [], titulo = "Ver rol", datos = {} }) => {
  const dataPermisos = dataFormated(datos.permisos);
  const sinPermisos = campos.filter(campo => campo.nombre !== "permisos");
  
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
    <ModalVerGenerico show={show} campos={sinPermisos} datos={datos} onClose={onClose} titulo={titulo}>
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
                title="Permisos"
              />
            </div>

            <TableGeneric
              data={paginatedData}
              columns={columnasPermisosGenericas}
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
    </ModalVerGenerico>
  );
};

export default ModalVerPermisos;