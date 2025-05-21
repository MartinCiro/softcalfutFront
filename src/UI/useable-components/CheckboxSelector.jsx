import { Form } from "react-bootstrap";

export function CheckboxSelector({
    options,
    selectedValues = [],
    onChange,
    ordenPermisos,
    iconosPermiso,
    title = "",
}) {
    const toggle = (permiso) => {
        const exists = selectedValues.includes(permiso);
        const newSelected = exists
            ? selectedValues.filter((p) => p !== permiso)
            : [...selectedValues, permiso];

        onChange(newSelected);
    };

    const opcionesOrdenadas = ordenPermisos.filter((p) => options.includes(p));

    return (
        <div>
            {title && (
                <div className="text-center mb-3 fw-bold">
                    <h4>{title}</h4>
                </div>
            )}
            <div className="d-flex flex-wrap gap-4 justify-content-center">
                {opcionesOrdenadas.map((permiso) => {
                    const icono = iconosPermiso[permiso] || permiso;
                    const isChecked = selectedValues.includes(permiso); // ✅ usa solo props

                    return (
                        <div
                            key={permiso}
                            className="d-flex flex-column align-items-center"
                            title={permiso}
                            style={{ minWidth: 80 }}
                        >
                            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{icono}</div>
                            <Form.Check
                                type="checkbox"
                                id={`chk-${permiso}`}
                                checked={isChecked}
                                label=""
                                onChange={() => toggle(permiso)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
