export const columnsNota = [
    { key: "nombre", label: "Nombre de la nota" },
    { key: "descripcion", label: "Descripcion" },
];

export const camposNota = columnsNota.map(({ key, label }) => ({
  nombre: key,
  label,
}));