export const columnasJugadoresGenericas = [
  { key: "documento", label: "Documento" },
  { key: "nombres", label: "Nombres" },
  { key: "estado", label: "Estado" },
];

export const jugadoresAdaptados = (jugadores) => jugadores.map(
  ([documento = "", nombres = "", apellidos = "", estado = ""], index) => ({
    id: index,
    documento,
    nombres: `${nombres} ${apellidos}`,
    estado,
  })
);



