import { useState, useEffect } from "react";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import { CheckboxSelector } from "@componentsUseable/CheckboxSelector";
import { ordenPermisos, iconosPermiso } from "@constants/permissionConfig";

export function PermisoCreador({
    show,
    onClose,
    permisosDisponibles,
    onSubmit,
    campos,
    titulo = "Crear permiso"
}) {
    // Estado para campos del formulario
    const [formValues, setFormValues] = useState({});

    // Estado para permisos seleccionados
    const [seleccionados, setSeleccionados] = useState([]);

    // Al abrir o cerrar el modal se limpia todo
    useEffect(() => {
        if (show) {
            setFormValues({});
            setSeleccionados([]);
        }
    }, [show]);
    const permisosPlano = permisosDisponibles.flatMap(p => p.permisos);
    const permisosUnicos = [...new Set(permisosPlano)];
    // Manejo del cambio de los campos del formulario
    const handleFormChange = (name, value) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    // Manejo del submit
    const handleGuardar = () => {
        // Combinar campos y permisos seleccionados para enviar
        onSubmit({
            ...formValues,
            permisosSeleccionados: seleccionados
        });
    };

    return (
        <CreateModalFormulario
            campos={campos}
            datos={formValues}
            show={show}
            onClose={onClose}
            titulo={titulo}
            onChange={handleFormChange}
            onSubmit={handleGuardar}
        >
            <CheckboxSelector
                options={permisosUnicos}
                selectedValues={seleccionados}
                onChange={setSeleccionados}
                ordenPermisos={ordenPermisos}
                iconosPermiso={iconosPermiso}
                title="Seleccione los permisos"
            />
        </CreateModalFormulario>
    );
}
export default PermisoCreador;