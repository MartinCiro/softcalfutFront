import React, { useState } from "react";

import SelectSearch from "@componentsUseable/SelectSearch";
import RadioSelection from "@componentsUseable/RadioSelection";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import { camposProgramacion } from "@constants/programacionConfig";

const ModalCreateProgramacion = ({
  show,
  onClose,
  titulo = "Crear Programación",
  equipos = [],
  lugares = [],
  categorias = [],
  torneos = [],
  onSubmit,
  loading,
}) => {
  const camposFiltrados = camposProgramacion.filter(
    campo => !["eventos", "local", "visitante", "rama", "lugar", "dia", "hora", "categoria"].includes(campo.nombre)
  );

  const [genero, setGenero] = useState("M");
  const [local, setLocal] = useState(null);
  const [visitante, setVisitante] = useState(null);
  const [lugar, setLugar] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [torneo, setTorneo] = useState(null);

  const [hora, setHora] = useState("12");
  const [minuto, setMinuto] = useState("00");
  const [ampm, setAmPm] = useState("a.m.");

  const handleGuardar = (formData) => {
    onSubmit({
      ...formData,
      lugar: lugar?.id,
      equipoLocal: local?.id,
      equipoVisitante: visitante?.id,
      rama: genero,
      categoria: categoria?.id,
      hora: `${hora}:${minuto} ${ampm}`,
      torneo: torneo?.id
    });
    onClose();
  };

  const hoursOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return {
      label: String(hour).padStart(2, "0"),
      value: String(hour).padStart(2, "0")
    };
  });

  const minutesOptions = Array.from({ length: 60 }, (_, i) => {
    return {
      label: String(i).padStart(2, "0"),
      value: String(i).padStart(2, "0")
    };
  });

  const ampmOptions = [
    { label: "a.m.", value: "a.m." },
    { label: "p.m.", value: "p.m." }
  ];

  return (
    <CreateModalFormulario
      show={show}
      onClose={onClose}
      titulo={titulo}
      campos={camposFiltrados}
      onSubmit={handleGuardar}
      loading={loading}
    >
      <div className="d-flex flex-column flex-md-row gap-2 mb-4">
        <SelectSearch
          label="Hora"
          options={hoursOptions}
          onChange={(opt) => setHora(opt.value)}
          value={hoursOptions.find(opt => opt.value === hora)}
          placeholder="Hora"
        />

        <SelectSearch
          label="Minuto"
          options={minutesOptions}
          value={minutesOptions.find(opt => opt.value === minuto)}
          onChange={(opt) => setMinuto(opt.value)}
          placeholder="Minuto"
        />

        <SelectSearch
          label="AM/PM"
          options={ampmOptions}
          value={ampmOptions.find(opt => opt.label === ampm)}
          onChange={(opt) => setAmPm(opt.label)}
          placeholder="AM/PM"
        />
      </div>

      <RadioSelection
        options={[
          { label: "M", value: "M" },
          { label: "F", value: "F" }
        ]}
        initialValue={genero}
        onChange={setGenero}
      />

      <SelectSearch
        label="Categoria"
        options={categorias}
        value={categoria}
        onChange={setCategoria}
        getOptionValue={c => c.id}
        getOptionLabel={c => c.nombre_categoria}
        placeholder="Seleccionar categoría"
        className="mb-4"
      />

      <SelectSearch
        label="Lugar"
        options={lugares}
        value={lugar}
        onChange={setLugar}
        getOptionValue={l => l.id}
        getOptionLabel={l => l.nombre}
        placeholder="Seleccionar lugar"
        className="mb-4"
      />

      <SelectSearch
        label="Local"
        options={equipos}
        value={local}
        onChange={setLocal}
        getOptionValue={e => e.id}
        getOptionLabel={e => e.nom_equipo}
        placeholder="Equipo local"
        className="mb-4"
      />

      <SelectSearch
        label="Visitante"
        options={equipos}
        value={visitante}
        onChange={setVisitante}
        getOptionValue={v => v.id}
        getOptionLabel={v => v.nom_equipo}
        className="mb-4"
        placeholder="Equipo visitante"
      />

      <SelectSearch
        label="Torneo"
        options={torneos}
        value={torneo}
        onChange={setTorneo}
        getOptionValue={e => e.id}
        getOptionLabel={e => e.nombre_torneo}
        className="mb-4"
        placeholder="Seleccionar torneo"
      />
    </CreateModalFormulario>
  );
};

export default ModalCreateProgramacion;
