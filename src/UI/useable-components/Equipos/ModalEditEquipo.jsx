import React, { useState, useMemo } from "react";

import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import { useJugadoresLogic } from "@hooks/equipo/useJugadoresLogic";

import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import EmptyMessage from "@componentsUseable/EmptyMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import SelectSearch from "@componentsUseable/SelectSearch";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";

const ModalEditEquipo = ({
  show,
  onClose,
  campos,
  titulo = "Editar Equipo",
  usuarios = [],
  categorias = [],
  datos = {},
  onSubmit,
  loading,
}) => {
  // Filtra campos no editables
  const camposFiltrados = campos.filter(
    campo => !["documento_representante", "estado_representante", "nombre_representante", "categoria"].includes(campo.nombre)
  );

  // Jugadores disponibles (misma lógica que en CreateEquipo)
  const jugadoresDisponibles = useMemo(
    () => usuarios.filter(u => ["Jugador", "AdminJugador"].includes(u.rol)),
    [usuarios]
  );

  // Lógica reutilizada de selección de jugadores
  const { jugadoresSeleccionados, toggleJugador } = useJugadoresLogic(
    jugadoresDisponibles,
    datos.jugadores || []
  );

  // Representante y categoría (estado inicial desde props)
  const [encargado, setEncargado] = useState(datos.representante || null);
  const [categoria, setCategoria] = useState(
    categorias.find(c => c.nombre_categoria === datos.categoria) || null
  );

  const { query, setQuery, filtered } = useSearch(jugadoresDisponibles, "nombres");
  const pagination = usePagination(filtered, 6);

  const columnas = [
    { key: "nombres", label: "Nombre" },
    { key: "documento", label: "Documento" },
    {
      key: "seleccionado",
      label: "Seleccionar",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={jugadoresSeleccionados.some(j => j.documento === row.documento)}
          onChange={() => toggleJugador(row)}
        />
      ),
    },
  ];

  const handleGuardar = (formData) => {
    onSubmit({
      ...formData,
      encargado: encargado?.documento,
      jugadores: jugadoresSeleccionados.map(j => j.documento),
      categoria: categoria?.nombre_categoria,
    });
    onClose();
  };

  return (
    <ModalEditForm
      show={show}
      onClose={onClose}
      titulo={titulo}
      campos={camposFiltrados}
      datos={datos}
      onSubmit={handleGuardar}
      loading={loading}
    >
      {/* Selects reutilizados */}
      <SelectSearch
        label="Categoría"
        options={categorias}
        value={categoria}
        onChange={setCategoria}
        getOptionValue={c => c.id}
        getOptionLabel={c => c.nombre_categoria}
        className="mb-4"
      />

      <SelectSearch
        label="Encargado"
        options={jugadoresDisponibles}
        value={encargado}
        onChange={setEncargado}
        getOptionLabel={u => `${u.nombres} (${u.documento})`}
        className="mb-4"
      />

      {/* Lista de jugadores (mismo componente que CreateEquipo) */}
      <div className="mt-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar jugadores..."
          className="mb-3"
        />

        {filtered.length === 0 ? (
          <EmptyMessage mensaje="No hay jugadores disponibles" />
        ) : (
          <>
            <TableGeneric
              data={pagination.paginatedData}
              columns={columnas}
              sinDatos="No se encontraron jugadores"
            />
            <Paginator {...pagination} />
          </>
        )}
      </div>
    </ModalEditForm>
  );
};

export default ModalEditEquipo;