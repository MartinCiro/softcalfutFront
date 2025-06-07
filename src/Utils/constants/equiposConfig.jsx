export const columnsEquipo = [
    { key: "nom_equipo", label: "Nombre del equipo" },
    { key: "categoria", label: "Categoria" },
    {
        key: "representante",
        label: "Nombre del representante",
        render: (rep) => rep ? `${rep.nombre}` : "Sin representante"
    }
];

export const camposEquipo = [
    { nombre: "nom_equipo", label: "Nombre del equipo" },
    {
        nombre: "nombre_representante",
        label: "Representante",
        render: (_, datos) => datos.representante?.nombre || "Sin representante"
    },
    {
        nombre: "categoria",
        label: "Categoria"
    },
    {
        nombre: "documento_representante",
        label: "Documento del representante",
        render: (_, datos) => datos.representante?.documento || "Sin documento"
    },
    {
        nombre: "estado_representante",
        label: "Estado del representante",
        render: (_, datos) => datos.representante?.estado || "Sin estado"
    }
];