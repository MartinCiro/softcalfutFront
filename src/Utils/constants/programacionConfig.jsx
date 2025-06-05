const createField = (nombre, label, config = {}) => ({
  key: nombre,
  nombre,
  label,
  ...(config.render && { render: config.render }),
  tipo: config.tipo || "text",
  ...(config.isEventField && { isEventField: true }), // Para identificar campos que están en eventos
  ...(config.isParentField && { isParentField: true }) // Para identificar campos del padre
});

// Usar para columnas
export const columnsProgramacion = [
  createField("fecha", "Fecha de encuentro", { isParentField: true }),
  createField("competencia", "Nombre de la competencia", { isParentField: true }),
  createField("eventos", "Eventos", { 
    render: (eventos) => eventos ? eventos.length : 0 
  })
];

// Usar para campos
export const camposProgramacion = [
  createField("fecha", "Fecha de encuentro", { tipo: "date", isParentField: true }),
  createField("competencia", "Nombre de la competencia", { isParentField: true }),
  createField("dia", "Dia", { isParentField: true }),
  createField("local", "Local", { 
    render: (rep) => rep ? `${rep.local}` : "Sin representante",
    isEventField: true
  }),
  createField("visitante", "Visitante", { isEventField: true }),
  createField("hora", "Hora", { isEventField: true }),
  createField("lugar", "Lugar", { isEventField: true }),
  createField("rama", "Nombre de la programacion", { isEventField: true }),
];