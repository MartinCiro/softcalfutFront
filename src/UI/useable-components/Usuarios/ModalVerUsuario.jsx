import React from "react";
import { Badge } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";

const ModalVerUsuario = ({ 
  show, 
  onClose, 
  usuario,
  campos
}) => {
  //limpiar fecha de usuarios
  usuario.fecha_nacimiento = usuario.fecha_nacimiento.split("T")[0].split("-").reverse().join("/");
  
  return (
    <ModalVerGenerico 
      show={show}
      onClose={onClose}
      titulo="Permisos del Usuario"
      campos={campos}
      datos={usuario}
    >
      <div className="mt-4">
        <h5 className="mb-3">
          <MDBIcon icon="user-shield" className="me-2" />
          Permisos asignados al rol {usuario?.rol || ''}
        </h5>
        
        {Object.keys(usuario.permisos).length > 0 ? (
          <div className="permisos-container">
            {Object.entries(usuario.permisos).map(([categoria, permisos]) => (
              <div key={categoria} className="mb-4">
                <h6 className="text-uppercase text-muted mb-2">
                  {categoria.replace(/([A-Z])/g, ' $1').trim()}
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {permisos.map(permiso => (
                    <Badge 
                      key={permiso} 
                      bg="success" 
                      className="d-flex align-items-center"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <MDBIcon icon="check-circle" className="me-1" />
                      {permiso.split(':')[1]}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            Este rol no tiene permisos asignados
          </div>
        )}
      </div>
    </ModalVerGenerico>
  );
};

export default ModalVerUsuario;