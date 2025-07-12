import React, { useMemo, useState } from "react";

import useSearch from "@hooks/useSearch";
import usePagination from "@hooks/usePagination";
import { useJugadoresLogic } from "@hooks/equipo/useJugadoresLogic";

import ModalCreate from "@componentsUseable/FormModal/CreateModalFormulario";
import SelectSearch from "@componentsUseable/SelectSearch";
import SearchInput from "@componentsUseable/SearchInput";
import TableGeneric from "@componentsUseable/TableGeneric";
import Paginator from "@componentsUseable/Paginator";
import EmptyMessage from "@componentsUseable/EmptyMessage";

const CreateModalEquipo = ({
  show,
  onClose,
  campos,
  titulo = "Crear Equipo",
  usuarios = [],
  categorias = [],
  onSubmit,
  loading,
}) => {
  const jugadoresDisponibles = useMemo(
    () => usuarios.filter(u => ["Jugador", "AdminJugador"].includes(u.rol)),
    [usuarios]
  );

  const { jugadoresSeleccionados, toggleJugador } = useJugadoresLogic(jugadoresDisponibles, []);

  const [encargado, setEncargado] = useState(null);
  const [categoria, setCategoria] = useState(null);

  const { query, setQuery, filtered } = useSearch(jugadoresDisponibles, "nombres");
  const pagination = usePagination(filtered, 6);

  const camposFiltrados = campos.filter(
    campo =>
      !["documento_representante", "estado_representante", "nombre_representante", "categoria"].includes(campo.nombre)
  );

  const handleFinalSubmit = async (formData) => {
    const dataFinal = {
      ...formData,
      encargado: encargado?.documento,
      jugadores: jugadoresSeleccionados.map(j => j.documento),
      categoria: categoria?.nombre_categoria,
    };
    await onSubmit(dataFinal);
    onClose();
  };

  const handleExtraChange = (name, value) => {
    if (name === "encargado") setEncargado(value);
    if (name === "categoria") setCategoria(value);
  };

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

  return (
    <ModalCreate
      show={show}
      onClose={onClose}
      titulo={titulo}
      campos={camposFiltrados}
      onSubmit={handleFinalSubmit}
      onChange={handleExtraChange}
      loading={loading}
    >
      {/* Componentes personalizados */}
      <SelectSearch
        label="Categoría"
        options={categorias}
        value={categoria}
        onChange={value => handleExtraChange("categoria", value)}
        getOptionLabel={c => c.nombre_categoria}
        className="mb-4"
      />

      <SelectSearch
        label="Encargado"
        options={jugadoresDisponibles}
        value={encargado}
        onChange={value => handleExtraChange("encargado", value)}
        getOptionLabel={u => `${u.nombres} (${u.documento})`}
        className="mb-4"
      />

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
    </ModalCreate>
  );
};

export default CreateModalEquipo;
