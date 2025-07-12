import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalVerRol from "@componentsUseable/Roles/ModalVerRol";
import useHasPermission from "@hooks/useHasPermission";

const ModalVerUsuario = ({ 
  show, 
  onClose, 
  usuario,
  campos
}) => {
  const [showPermisos, setShowPermisos] = useState(false);
  
  usuario.fecha_nacimiento = usuario.fecha_nacimiento.split("T")[0].split("-").reverse().join("/");
  
  const handleVerPermisos = () => setShowPermisos(true);

  const handleClosePermisos = () => setShowPermisos(false);
  const canViewPermiso = useHasPermission('permisos:Lee');
  return (
    <>
      <ModalVerGenerico 
        show={show}
        onClose={onClose}
        titulo="Información del Usuario"
        campos={campos}
        datos={usuario}
        accionesAdicionales={
          usuario.rol && (
            <Button 
              variant="primary" 
              onClick={handleVerPermisos}
              className="ms-2"
            >
              <MDBIcon icon="key" className="me-2" />
              Ver permisos
            </Button>
          )
        }
      />
      
      {/* Modal para mostrar los permisos del rol */}
      {canViewPermiso && usuario.rol && (
        <ModalVerRol
          show={showPermisos}
          onClose={handleClosePermisos}
          titulo={`Permisos del rol ${usuario.rol}`}
          datos={usuario}
        />
      )}
    </>
  );
};

export default ModalVerUsuario;