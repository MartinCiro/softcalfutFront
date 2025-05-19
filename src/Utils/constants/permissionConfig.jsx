import { MDBIcon } from "mdb-react-ui-kit";

export const iconosPermiso = {
  Lee: <MDBIcon icon="eye" />,
  Edita: <MDBIcon icon="edit" />,
  Elimina: <MDBIcon icon="trash" />,
  Crea: <MDBIcon icon="plus" />,
  Actualiza: <MDBIcon icon="refresh" />,
  Asigna: <MDBIcon icon="users" />,
  LeeProfile: <MDBIcon icon="eye" />,
};

export const ordenPermisos = [
  "Lee",
  "Crea",
  "Actualiza",
  "Elimina",
  "Asigna",
  "LeeProfile",
];

export const columnasPermisosGenericas = [
  { key: "entidad", label: "Entidad" },
  {
    key: "permisos",
    label: "Permisos",
    render: (permisos) => {
      const permisosOrdenados = [...permisos].sort((a, b) => {
        const indexA = ordenPermisos.indexOf(a);
        const indexB = ordenPermisos.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      return permisosOrdenados.map((permiso, i) => (
        <span key={i} className="me-2" title={permiso}>
          {iconosPermiso[permiso] || permiso}
        </span>
      ));
    },
  },
];
