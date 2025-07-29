import React from "react";
import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import EmptyMessage from "@componentsUseable/EmptyMessage";
import { columnasJugadoresGenericas } from "@constants/teamConfig";


const ModalVerEquipo = ({ show, onClose, campos = [], titulo = "Ver equipo", datos = {} }) => {
  const jugadores = datos.jugadores || [];

  const sinJugadores = campos.filter(campo => campo.nombre !== "jugadores");
  const { query, setQuery, filtered } = useSearch(jugadores, ["nombres"]);

  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);

  return (
    <ModalVerGenerico show={show} campos={sinJugadores} datos={datos} onClose={onClose} titulo={titulo} className="modal-editar-permisos">
      <div>
        {jugadores.length === 0 ? (
          <EmptyMessage mensaje="Este equipo no tiene jugadores registrados." />
        ) : (
          <>
            <div className="mb-3">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Buscar jugador por nombre..."
                title="Jugadores"
              />
            </div>

            <TableGeneric
              data={paginatedData}
              columns={columnasJugadoresGenericas}
              showEdit={false}
              showView={false}
              showDelete={false}
              sinDatos={"No se ha encontrado el jugador o jugadores buscados."}
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

export default ModalVerEquipo;
