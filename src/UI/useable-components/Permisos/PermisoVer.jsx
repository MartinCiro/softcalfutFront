import React from "react";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import { ordenPermisos, iconosPermiso } from "@constants/permissionConfig";

const ModalVerPermiso = ({ datos = {}, ...props }) => {
  if (!datos || !datos.permisos) return null;

  const permisos = datos.permisos;

  return (
    <ModalVerGenerico {...props} datos={datos}>
      <div className="mt-4">
        <strong>Permisos:</strong>
        <div className="d-flex gap-3 mt-2 flex-wrap">
          {ordenPermisos.map((permiso) =>
            permisos.includes(permiso) ? (
              <div key={permiso} className="text-center" title={permiso}>
                <div>{iconosPermiso[permiso]}</div>
                <div style={{ fontSize: "0.85rem" }}>{permiso}</div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </ModalVerGenerico>
  );
};

export default ModalVerPermiso;
