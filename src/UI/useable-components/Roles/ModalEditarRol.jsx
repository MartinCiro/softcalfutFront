import React, { useState, useEffect } from "react";
import EmptyMessage from "@componentsUseable/EmptyMessage";
import PermisosEditor from "@componentsUseable/Permisos/PermisosEditor";
import ModalEditarGenerico from "@componentsUseable/FormModal/EditModalFormulario";
import useHasPermission from "@hooks/useHasPermission";

const ModalEditarRol = ({
    show,
    onClose,
    campos,
    titulo = "Editar Rol",
    permisosActuales = [],
    datos = {},
    onSubmit
}) => {
    const [permisosEditados, setPermisosEditados] = useState([]);
    const sinPermisos = campos.filter(campo => campo.nombre !== "permisos");

    const [formValues, setFormValues] = useState({
        nombre: datos.nombre || "",
        descripcion: datos.descripcion || "",
    });

    const generarPermisosCompletos = () => {
        return permisosActuales.map(actual => {
            const permisosEncontrados = datos.permisos?.[actual.entidad] || [];
            return {
                entidad: actual.entidad,
                permisos: actual.permisos.filter(p => permisosEncontrados.includes(p)),
            };
        });
    };

    useEffect(() => {
        if (permisosActuales.length > 0) setPermisosEditados(generarPermisosCompletos());
    }, [datos, permisosActuales]);

    useEffect(() => {
        setFormValues({
            nombre: datos.nombre || "",
            descripcion: datos.descripcion || "",
        });
    }, [datos]);

    const handleFormChange = (campo, valor) => {
        setFormValues(prev => ({ ...prev, [campo]: valor }));
    };

    const handleGuardar = () => {
        const permisosFiltrados = permisosEditados.filter(ent => ent.permisos.length > 0);
        onSubmit({
            ...formValues,
            permisos: permisosFiltrados,
        });
    };
    const canAsign = useHasPermission('roles:Asigna:Permisos');

    return (
        <ModalEditarGenerico
            campos={sinPermisos}
            datos={formValues}
            show={show}
            onClose={onClose}
            titulo={titulo}
            onChange={handleFormChange}
            onSubmit={handleGuardar}
        >
            {permisosEditados.length === 0 ? (
                <EmptyMessage mensaje="Este rol no tiene permisos asignados." />
            ) : (
                canAsign &&
                <PermisosEditor
                    permisosEditados={permisosEditados}
                    setPermisosEditados={setPermisosEditados}
                    permisosActuales={permisosActuales}
                />
            )}
        </ModalEditarGenerico>
    );
};

export default ModalEditarRol;
