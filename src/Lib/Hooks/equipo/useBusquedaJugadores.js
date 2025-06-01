import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";

export const useBusquedaJugadores = (jugadoresDisponibles = []) => {
  const { query, setQuery, filtered } = useSearch(jugadoresDisponibles, "nombres");
  const pagination = usePagination(filtered, 6);

  return {
    query,
    setQuery,
    filteredJugadores: filtered,
    pagination
  };
};