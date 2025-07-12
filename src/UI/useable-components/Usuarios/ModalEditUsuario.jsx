import React, { useMemo, useState, useEffect } from "react";
import SelectSearch from "@componentsUseable/SelectSearch";
import { MDBIcon } from "mdb-react-ui-kit";
import useHasPermission from "@hooks/useHasPermission";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";

const EditModalUsuario = ({
  show,
  onClose,
  onSubmit,
  loading,
  datos,
  campos = [],
  roles = [],
  estados = [],
}) => {
  const camposObligatorios = [
    "nombres",
    "apellido",
    "nom_user",
    "fecha_nacimiento",
    "documento",
    "email"
  ];
  // Filtramos los campos para excluir 'rol' y 'estado'
  const camposFiltrados = useMemo(() =>
    campos
      .filter(campo => campo.nombre !== "rol" && campo.nombre !== "estado")
      .map(campo => ({
        ...campo,
        label: camposObligatorios.includes(campo.nombre)
          ? `${campo.label}*`
          : campo.label
      })),
    []
  );

  // Estado para los valores seleccionados
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  // Inicializar valores seleccionados con los datos del usuario
  useEffect(() => {
    if (datos) {
      if (datos.rol && roles.length > 0) {
        const rol = roles.find(r => r.nombre === datos.rol);
        setRolSeleccionado(rol || null);
      }
      if (datos.estado && estados.length > 0) {
        const estado = estados.find(e => e.nombre === datos.estado);
        setEstadoSeleccionado(estado || null);
      }
    }
  }, [datos, roles, estados]);

  // Transformar roles y estados para el SelectSearch
  const opcionesRoles = useMemo(() =>
    roles.map(rol => ({
      value: rol.id,
      label: rol.label || rol.nombre,
      id: rol.id,
      nombre: rol.label || rol.nombre,
    })),
    [roles]
  );

  const opcionesEstados = useMemo(() =>
    estados
      .filter(estado =>
        estado.nombre === "Activo" ||
        estado.nombre === "Inactivo" ||
        estado.nombre === "Penalizado"
      )
      .map(estado => ({
        value: estado.id,
        label: estado.nombre,
        id: estado.id,
        nombre: estado.nombre,
        estado: estado.nombre === "Activo"
      })),
    [estados]
  );

  const handleExtraChange = (name, value) => {
    if (name === "rol") setRolSeleccionado(value);
    if (name === "estado") setEstadoSeleccionado(value);
  };

  const handleSubmit = async (formData) => {
    const dataFinal = {
      nombres: formData.nombres,
      id_rol: rolSeleccionado?.id,
      apellido: formData.apellido,
      numero_documento: formData.documento,
      email: formData.email,
      estado_id: estadoSeleccionado?.id,
      info_perfil: formData.info_perfil,
      nom_user: formData.nom_user,
      numero_contacto: formData.num_contacto,
      fecha_nacimiento: formData.fecha_nacimiento,
    };
    await onSubmit(dataFinal);
  };

  const canEdit = useHasPermission('usuarios:Actualiza');
  const canViewEstado = useHasPermission('estados:Lee');
  const canAsignEstado = useHasPermission('estados:Asigna:Usuarios');
  const canViewRol = useHasPermission('roles:Lee');
  const canAsignRol = useHasPermission('roles:Asigna:Usuarios');

  return (
    canEdit &&
    <ModalEditForm
      show={show}
      onClose={onClose}
      titulo="Editar Usuario"
      campos={camposFiltrados}
      datos={datos}
      onSubmit={handleSubmit}
      loading={loading}
    >
      {/* Selector de Rol */}
      {canViewRol && canAsignRol && (
        <div className="mb-4">
          <SelectSearch
            label="Rol"
            options={opcionesRoles}
            value={rolSeleccionado}
            onChange={(rol) => handleExtraChange("rol", rol)}
            getOptionLabel={(rol) => rol.nombre}
            getOptionValue={(rol) => rol.id}
          />
        </div>
      )}

      {/* Selector de Estado */}
      {canViewEstado && canAsignEstado && (
        <div className="mb-4">
          <SelectSearch
            label="Estado"
            options={opcionesEstados}
            value={estadoSeleccionado}
            onChange={(estado) => handleExtraChange("estado", estado)}
            getOptionLabel={(estado) => estado.nombre}
            getOptionValue={(estado) => estado.id}
          />
        </div>
      )}
    </ModalEditForm>
  );
};

export default EditModalUsuario;