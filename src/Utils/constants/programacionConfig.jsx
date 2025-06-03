const createField = (nombre, label, render = undefined, tipo = undefined) => ({
  key: nombre,
  nombre,
  label,
  ...(render && { render }),
  tipo: tipo || "text",
});

// Usar para columnas
export const columnsProgramacion = [
  createField("fecha", "Fecha de encuentro", (date) => new Date(date).toLocaleDateString()),
  createField("nombre_competencia", "Nombre de la competencia")
];

// Usar para campos
export const camposProgramacion = [
  createField("rama", "Nombre de la programacion"),
  createField("nombre_competencia", "Nombre de la competencia"),
  createField("lugarEncuentro", "Lugar de encuentro"),
  createField("fecha", "Fecha de encuentro", undefined, "date"),
  createField("equipoVisitante", "Visitante"),
  createField("equipoLocal", "Local"),
];
