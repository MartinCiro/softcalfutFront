import { useState } from "react";

export const useJugadoresLogic = (jugadoresDisponibles = [], jugadoresIniciales = []) => {
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState(
    jugadoresDisponibles.filter(u => 
      jugadoresIniciales.some(j => j.documento === u.documento)
    )
  );

  const toggleJugador = (jugador) => {
    setJugadoresSeleccionados(prev =>
      prev.some(j => j.documento === jugador.documento)
        ? prev.filter(j => j.documento !== jugador.documento)
        : [...prev, jugador]
    );
  };

  return { 
    jugadoresSeleccionados, 
    toggleJugador,
    jugadoresIds: jugadoresSeleccionados.map(j => j.documento)
  };
};