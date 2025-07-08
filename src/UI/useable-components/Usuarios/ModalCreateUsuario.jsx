import React, { useMemo, useState } from "react";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import SelectSearch from "@componentsUseable/SelectSearch";
import { MDBIcon } from "mdb-react-ui-kit";
import useHasPermission from "@hooks/useHasPermission";

const CreateModalUsuario = ({
  show,
  onClose,
  onSubmit,
  loading,
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
  
  // Filtrar y transformar roles
  const opcionesRoles = useMemo(() => 
    roles.map(rol => ({
      value: rol.id,
      label: rol.label || rol.nombre,
      id: rol.id,
      nombre: rol.label || rol.nombre,
    })), 
    [roles]
  );
  
  // Filtrar solo los estados permitidos (Activo, Inactivo, Penalizado)
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
        // Determinar si es estado activo (para el icono)
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
      passwd: formData.documento,
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
  const canCreate = useHasPermission('usuarios:Crea');
  const canViewEstado = useHasPermission('estados:Lee');
  const canAsignEstado = useHasPermission('estados:Asigna:Usuarios');
  const canViewRol = useHasPermission('roles:Lee');
  const canAsignRol = useHasPermission('roles:Asigna:Usuarios');

  return (
    canCreate &&
    <CreateModalFormulario
      show={show}
      onClose={onClose}
      titulo="Crear Nuevo Usuario"
      campos={camposFiltrados}
      onSubmit={handleSubmit}
      loading={loading}
      onChange={handleExtraChange}
    >
      {/* Selector de Rol */}
      {canViewRol && canAsignRol && (
        <div className="mb-4">
          <SelectSearch
            label="Rol"
            options={opcionesRoles}
            value={rolSeleccionado}
            onChange={(value) => handleExtraChange("rol", value)}
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
          onChange={(value) => handleExtraChange("estado", value)}
          getOptionLabel={(estado) => estado.nombre}
          getOptionValue={(estado) => estado.id}
        />
      </div>
      )}
    </CreateModalFormulario>
  );
};

export default CreateModalUsuario;