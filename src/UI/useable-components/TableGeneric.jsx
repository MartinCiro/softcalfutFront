import { Table, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import "@styles/TableGeneric.css";

const TableGeneric = ({
    data = [],
    columns = [],
    onView,
    onEdit,
    onDelete,
    onCreate,
    showView = true,
    showEdit = true,
    showDelete = false,
    showCreate = false,
    title = "",
    sinDatos = "Sin datos disponibles",
}) => {
    // Verifica si se debe mostrar la columna de acciones
    const mostrarAcciones = showView || showEdit || showDelete || showCreate;

    return (
        <div className="table-responsive mb-4 table-generic">
            {title && <h5 className="mb-3 fw-bold justify-content-center align-items-center d-flex">{title}</h5>}
            <Table bordered hover responsive className="align-middle">
                <thead className="table-dark">
                    <tr>
                        {columns
                            .filter((col) => col.key !== "id")
                            .map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        {mostrarAcciones && <th className="text-center">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (mostrarAcciones ? 1 : 0)} className="text-center">
                                {sinDatos}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.id || index}>
                                {columns
                                    .filter((col) => col.key !== "id")
                                    .map((col) => (
                                        <td key={col.key} title={item[col.key]}>
                                            <div className="text-truncate">
                                                {col.render
                                                    ? col.render(item[col.key], item)
                                                    : Array.isArray(item[col.key])
                                                        ? item[col.key].map((icon, i) => (
                                                            <span key={i} className="me-2">{icon}</span>
                                                        ))
                                                        : item[col.key]}
                                            </div>
                                        </td>

                                    ))}

                                {mostrarAcciones && (
                                    <td className="text-center table-actions">
                                        {showView && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="me-2 view-button"
                                                title="Ver"
                                                onClick={() => onView?.(item)}
                                            >
                                                <MDBIcon fas icon="eye" />
                                            </Button>
                                        )}
                                        {showEdit && (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2 edit-button"
                                                title="Editar"
                                                onClick={() => onEdit?.(item)}
                                            >
                                                <MDBIcon fas icon="pencil-alt" />
                                            </Button>
                                        )}
                                        {showDelete && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                title="Eliminar"
                                                onClick={() => onDelete?.(item)}
                                            >
                                                <MDBIcon fas icon="trash" />
                                            </Button>
                                        )}
                                        {showCreate && (
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                title="Crear"
                                                onClick={() => onCreate?.(item)}
                                            >
                                                <MDBIcon fas icon="plus" />
                                            </Button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default TableGeneric;
