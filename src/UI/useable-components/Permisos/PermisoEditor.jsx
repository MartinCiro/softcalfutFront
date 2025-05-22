import { useState, useEffect } from "react";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";
import { CheckboxSelector } from "@componentsUseable/CheckboxSelector";
import { ordenPermisos, iconosPermiso } from "@constants/permissionConfig";

export function PermisoEditor({ show, onClose, permisosSeleccionado, onGuardar, camposPermiso }) {
    const [formState, setFormState] = useState(permisosSeleccionado || {});

    useEffect(() => {
        setFormState(permisosSeleccionado || {});
    }, [permisosSeleccionado]);

    const handleChange = (name, value) => {
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePermisosChange = (nuevosPermisos) => {
        const entidad = formState.entidad;
        setFormState((prev) => ({
            ...prev,
            permisosSeleccionados: {
                ...prev.permisosSeleccionados,
                [entidad]: nuevosPermisos
            }
        }));
    };

    const handleSubmit = (formData) => {
        onGuardar(formData);
    };

    const entidadActual = formState.entidad;
    const permisosDisponibles = formState.permisos || [];
    const permisosSeleccionadosActuales = formState.permisosSeleccionados?.[entidadActual] || [];
    

    return (
        <ModalEditForm
            show={show}
            onClose={onClose}
            titulo="Editar permisos"
            campos={camposPermiso}
            datos={formState}
            onSubmit={handleSubmit}
            onChange={handleChange}
        >
            {entidadActual && (
                <CheckboxSelector
                    options={permisosDisponibles}                
                    selectedValues={permisosSeleccionadosActuales}        
                    onChange={handlePermisosChange}
                    ordenPermisos={ordenPermisos}
                    iconosPermiso={iconosPermiso}
                />
            )}
        </ModalEditForm>
    );
}


export default PermisoEditor;
