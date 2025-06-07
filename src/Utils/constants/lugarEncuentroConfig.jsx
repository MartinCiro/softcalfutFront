export const columnsLugarEncuentro = [
    { key: "nombre", label: "Nombre del lugar de encuentro" },
    { key: "direccion", label: "Direccion" },
];

export const camposLugarEncuentro = columnsLugarEncuentro.map(({ key, label }) => ({
  nombre: key,
  label,
}));