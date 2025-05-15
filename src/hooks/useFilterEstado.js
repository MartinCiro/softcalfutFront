import { useState, useCallback } from "react";

const useFilterEstado = (initial = "Todos") => {
  const [estadoFiltro, setEstadoFiltro] = useState(initial);

  const toggleEstado = useCallback((nuevoEstado) => {
    setEstadoFiltro(nuevoEstado);
  }, []);

  const filtrar = useCallback((items) => {
    if (estadoFiltro === "Todos") return items;
    return items.filter((item) => item.estado === estadoFiltro);
  }, [estadoFiltro]);

  return {
    estadoFiltro,
    toggleEstado,
    filtrar,
  };
};

export default useFilterEstado;
