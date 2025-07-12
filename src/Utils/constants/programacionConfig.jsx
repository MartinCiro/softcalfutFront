const createField = (nombre, label, config = {}) => ({
  key: nombre,
  nombre,
  label,
  ...(config.render && { render: config.render }),
  tipo: config.tipo || "text",
  ...(config.isEventField && { isEventField: true }),
  ...(config.isParentField && { isParentField: true })
});

// Función auxiliar para simplificar la creación de campos comunes
const commonField = (nombre, label, extras = {}) => 
  createField(nombre, label, { ...extras });

// Función para campos de eventos
const typedField = (nombre, label, type = 'common', extras = {}) => 
  commonField(nombre, label, { 
    ...extras,
    ...(type === 'event' ? { isEventField: true } : {}),
    ...(type === 'parent' ? { isParentField: true } : {})
  });
  
// Campos comunes reutilizables
const commonFields = {
  categoria: (isParent = false) => 
    typedField("categoria", isParent ? "Nombre de la categoria" : "Categoría", 
      isParent ? 'parent' : 'common'),
  
  local: (isEvent = true) => 
    typedField("local", "Local", isEvent ? 'event' : 'common', 
      isEvent ? { render: (rep) => rep ? `${rep.local}` : "Sin representante" } : {}),
  
  visitante: (isEvent = true) => 
    typedField("visitante", "Visitante", isEvent ? 'event' : 'common'),
  
  hora: (isEvent = true) => 
    typedField("hora", "Hora", isEvent ? 'event' : 'common'),
  
  lugar: (isEvent = true) => 
    typedField("lugar", "Lugar", isEvent ? 'event' : 'common'),
  
  rama: (isEvent = true) => 
    typedField("rama", isEvent ? "Genero" : "Rama", 
      isEvent ? 'event' : 'common')
};

// Función para convertir a columnas
export const toColumns = (campos) => campos.map(({ nombre, label }) => ({ 
  key: nombre, 
  label 
}));

// Campos de programación
// Campos de programación usando la nueva función unificada
export const camposProgramacion = [
  typedField("fecha", "Fecha de encuentro", 'parent', { tipo: "date" }),
  typedField("categoria", "Categoria", 'parent'),
  typedField("dia", "Dia", 'parent'),
  typedField("local", "Local", 'event', {
    render: (rep) => rep ? `${rep.local}` : "Sin representante"
  }),
  typedField("visitante", "Visitante", 'event'),
  typedField("hora", "Hora", 'event'),
  typedField("lugar", "Lugar", 'event'),
  typedField("rama", "Genero", 'event'),
  typedField("eventos", "Eventos", 'parent', {
    render: (eventos) => eventos ? eventos.length : 0
  }),
  typedField("competencia", "Competencia", 'event'),
];

// Columnas de programación (filtradas)
export const columnsProgramacion = toColumns(
  camposProgramacion.filter(({ nombre }) => 
    ["fecha", "categoria", "eventos"].includes(nombre)
));

// Campos de eventos
export const camposEventos = [
  commonFields.categoria(),
  commonFields.local(false),
  commonFields.visitante(false),
  commonFields.hora(false),
  commonFields.lugar(false),
  commonFields.rama(false)
];

export const columnasEventos = toColumns(camposEventos);

// Campos para el modal
export const camposModal = (fechaSeleccionada, eventosDia) => [
  commonField("fechaCompleta", "Fecha", {
    render: () => fechaSeleccionada?.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }),
  commonField("totalEventos", "Total de eventos", {
    render: () => eventosDia?.length ?? 0
  })
];

export const columnasModal = toColumns(camposModal(null, []));