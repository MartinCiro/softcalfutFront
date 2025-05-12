import { useState } from "react";

const useToggleEstado = () => {
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const toggleEstado = (nuevoEstado) => {
    setEstadoFiltro(nuevoEstado);
  };

  const filtrarPorEstado = (lista) => {
    if (estadoFiltro === "Todos") return lista;
    return lista.filter(item => item.estado === estadoFiltro);
  };

  return { estadoFiltro, toggleEstado, filtrarPorEstado };
};

export default useToggleEstado;
