import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";

const CardGeneric = ({ data = [], onToggle, onView, onEdit }) => {
  return data.map((item) => (
    <Col key={`${item.id}-${item.estado}`} md={6} lg={4} className="mb-4">
      <Card className="h-100 shadow-sm position-relative card-custom">
        <div className="position-relative clamp-image">
          <Card.Img
            variant="top"
            src={item.imagenUrl}
            alt={item.titulo}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div
            className="clamp-tittle position-absolute bottom-0 w-100 text-center text-white bg-dark bg-opacity-75 py-2"
            style={{ fontWeight: "bold" }}
          >
            {item.titulo || "Sin título"}
          </div>
        </div>
        <Card.Body>
          <Card.Text className="clamp-text">
            {item.contenido || "Sin descripción"}
          </Card.Text>
          <div className="d-flex justify-content-between px-5 pb-3">
            <Link
              to="#"
              className={`nav-link ${item.estado === "Activo" ? "text-danger" : "text-success"}`}
              onClick={() => onToggle?.(item)}
              title={item.estado === "Activo" ? "Desactivar" : "Activar"}
            >
              <MDBIcon fas icon={item.estado === "Activo" ? "trash" : "undo"} className="me-1" />
            </Link>
            <Link to="#" className="nav-link text-white" onClick={() => onView?.(item)}>
              <MDBIcon fas icon="eye" className="me-1" />
            </Link>
            <Link to="#" className="nav-link edit" onClick={() => onEdit?.(item)}>
              <MDBIcon fas icon="pencil" className="me-1" />
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ));
};

export default CardGeneric;
