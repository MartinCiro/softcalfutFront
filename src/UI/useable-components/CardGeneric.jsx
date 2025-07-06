import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";

const CardGeneric = ({
  data = [],
  keys = {}, 
  onToggle,
  onView,
  onEdit,
  onCreate,
  onDelete,
  // Flags de visibilidad (valores por defecto)
  showView = true,
  showEdit = true,
  showDelete = false,
  showCreate = false,
  // Flags de estado (opcionales)
  disableView = false,
  disableEdit = false,
  disableDelete = false,
  disableCreate = false,
}) => {
  return data.map((item) => (
    <Col key={`${item[keys.id]}-${item[keys.status]}`} md={6} lg={4} className="mb-4">
      <Card className="h-100 shadow-sm position-relative card-custom">
        {showCreate && (
          <div className="position-absolute top-0 end-0 m-2">
            <Link 
              to="#" 
              className={`btn btn-sm btn-primary ${disableCreate ? 'disabled' : ''}`}
              onClick={!disableCreate ? () => onCreate?.(item) : undefined}
              style={disableCreate ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              title={disableCreate ? "Creación no disponible" : "Crear nuevo"}
            >
              <MDBIcon fas icon="plus" />
            </Link>
          </div>
        )}
        
        <div className="position-relative clamp-image">
          <Card.Img
            variant="top"
            src={item[keys.image]}
            alt={item[keys.title]}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div
            className="clamp-tittle position-absolute bottom-0 w-100 text-center text-white bg-dark bg-opacity-75 py-2"
            style={{ fontWeight: "bold" }}
          >
            {item[keys.title] || "Sin título"}
          </div>
        </div>
        
        <Card.Body>
          <Card.Text className="clamp-text">
            {item[keys.content] || "Sin descripción"}
          </Card.Text>
          
          <div className="d-flex justify-content-between px-5 pb-3">
            {/* Botón Eliminar/Desactivar */}
            {showDelete && (
              <Link
                to="#"
                className={`nav-link ${
                  item[keys.status] === "Activo" ? "text-danger" : "text-success"
                } ${disableDelete ? 'disabled' : ''}`}
                onClick={!disableDelete ? () => onToggle?.(item) : undefined}
                style={disableDelete ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                title={
                  disableDelete ? 
                    "Eliminación no disponible" : 
                    (item[keys.status] === "Activo" ? "Desactivar" : "Activar")
                }
              >
                <MDBIcon
                  fas
                  icon={item[keys.status] === "Activo" ? "trash" : "undo"}
                  className="me-1"
                />
              </Link>
            )}

            {/* Botón Ver */}
            {showView && (
              <Link 
                to="#" 
                className={`nav-link text-white ${disableView ? 'disabled' : ''}`}
                onClick={!disableView ? () => onView?.(item) : undefined}
                style={disableView ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                title={disableView ? "Visualización no disponible" : "Ver detalles"}
              >
                <MDBIcon fas icon="eye" className="me-1" />
              </Link>
            )}

            {/* Botón Editar */}
            {showEdit && (
              <Link 
                to="#" 
                className={`nav-link edit ${disableEdit ? 'disabled' : ''}`}
                onClick={!disableEdit ? () => onEdit?.(item) : undefined}
                style={disableEdit ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                title={disableEdit ? "Edición no disponible" : "Editar"}
              >
                <MDBIcon fas icon="pencil" className="me-1" />
              </Link>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  ));
};

export default CardGeneric;