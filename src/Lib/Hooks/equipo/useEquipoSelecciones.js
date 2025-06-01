import { useState } from "react";

export const useEquipoSelecciones = (datosIniciales = {}) => {
  const [encargado, setEncargado] = useState(datosIniciales.representante || null);
  const [categoria, setCategoria] = useState(datosIniciales.categoria || null);

  return {
    encargado,
    setEncargado,
    categoria,
    setCategoria,
    datosSeleccionados: {
      encargadoId: encargado?.documento,
      categoriaId: categoria?.id,
      categoriaNombre: categoria?.nombre_categoria
    }
  };
};