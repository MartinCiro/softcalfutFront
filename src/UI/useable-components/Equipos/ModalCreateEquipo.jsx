import React, { useMemo } from "react";
import { useJugadoresLogic } from "@hooks/equipo/useJugadoresLogic";
import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import Paginator from "@componentsUseable/Paginator";
import SearchInput from "@componentsUseable/SearchInput";
import EmptyMessage from "@componentsUseable/EmptyMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import SelectSearch from "@componentsUseable/SelectSearch";
import { useState } from "react";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";

const CreateEquipoModal = ({
  show,
  onClose,
  titulo = "Crear Equipo",
  campos = [],
  categorias = [],
  usuarios = [],
  onSubmit,
  loading: externalLoading = false,
  datosIniciales = {},
}) => {
  // Filtra campos no editables
  const camposFiltrados = campos.filter(
    campo => !["documento_representante", "estado_representante", "nombre_representante", "categoria"].includes(campo.nombre)
  );

  // Jugadores disponibles
  const jugadoresDisponibles = useMemo(
    () => usuarios.filter(u => ["Jugador", "AdminJugador"].includes(u.rol)),
    [usuarios]
  );

  // Lógica de selección de jugadores
  const { jugadoresSeleccionados, toggleJugador } = useJugadoresLogic(
    jugadoresDisponibles,
    datosIniciales.jugadores || []
  );

  // Representante y categoría
  const [encargado, setEncargado] = useState(datosIniciales.representante || null);
  const [categoria, setCategoria] = useState(datosIniciales.categoria || null);

  // Búsqueda y paginación de jugadores
  const { query, setQuery, filtered } = useSearch(jugadoresDisponibles, "nombres");
  const pagination = usePagination(filtered, 6);

  // Columnas para la tabla de jugadores
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

  const handleSubmit = (formData) => {
    const datosCompletos = {
      ...formData,
      encargado: encargado?.documento,
      jugadores: jugadoresSeleccionados.map(j => j.documento),
      categoria: categoria?.nombre_categoria,
    };
    onSubmit(datosCompletos);
  };

  return (
    <CreateModalFormulario
      show={show}
      onClose={onClose}
      titulo={titulo}
      campos={camposFiltrados}
      onSubmit={handleSubmit}
      loading={externalLoading}
      datos={datosIniciales}
    >
      {/* Selects para categoría y encargado */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <SelectSearch
            label="Categoría"
            options={categorias}
            value={categoria}
            onChange={setCategoria}
            getOptionLabel={c => c.nombre_categoria}
            getOptionValue={c => c.id}
            required
          />
        </div>
        <div className="col-md-6 mb-4">
          <SelectSearch
            label="Encargado"
            options={jugadoresDisponibles}
            value={encargado}
            onChange={setEncargado}
            getOptionLabel={u => `${u.nombres} (${u.documento})`}
            getOptionValue={u => u.documento}
            required
          />
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className="mt-4">
        <h5>Jugadores del equipo</h5>
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
    </CreateModalFormulario>
  );
};

export default CreateEquipoModal;