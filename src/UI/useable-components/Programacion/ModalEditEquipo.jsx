import React, { useState } from "react";

import SelectSearch from "@componentsUseable/SelectSearch";
import RadioSelection from "@componentsUseable/RadioSelection";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";
import { camposProgramacion } from "@constants/programacionConfig";

const ModalEditProgramacion = ({
  show,
  onClose,
  titulo = "Editar Programación",
  equipos = [],
  lugares = [],
  categorias = [],
  torneos = [],
  datos = {},
  onSubmit,
  loading,
}) => {
  const camposFiltrados = camposProgramacion.filter(
    campo => !["eventos", "local", "visitante", "rama", "lugar", "dia", "hora", "categoria"].includes(campo.nombre)
  );
  //const blockedCategory = (camposProgramacion.find(item => item.key === "categoria") || {}).bloqueado = true
  const [genero, setGenero] = useState(datos.rama || "M");

  const [local, setLocal] = useState(
    equipos.find(e => e.nom_equipo === datos.local) || null
  );

  const [visitante, setVisitante] = useState(
    equipos.find(e => e.nom_equipo === datos.visitante) || null
  );

  const [lugar, setLugar] = useState(
    lugares.find(l => l.nombre === datos.lugar) || null
  );

  const [categoria, setCategoria] = useState(
    categorias.find(l => l.nombre_categoria === datos.categoria) || null
  );

  const [torneo, setTorneo] = useState(
    torneos.find(t => t.nombre_torneo === datos.torneo) || null
  );

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

  // Generación de opciones de hora (1-12), minutos (00-59) y AM/PM
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

  // Estado inicial basado en la fecha
  const initialHours = Number(datos.hora.split(":")[0]);
  const initialMinutes = Number(datos.hora.split(":")[1].split(" ")[0]);
  const initialAmPm = datos.hora.includes("p.m.") ? "p.m." : "a.m.";

  const [hora, setHora] = useState(initialHours);

  const [minuto, setMinuto] = useState(
    String(initialMinutes).padStart(2, "0")
  );

  const [ampm, setAmPm] = useState(initialAmPm);

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
      <div className="d-flex flex-column flex-md-row gap-2 mb-4">
        <SelectSearch
          label="Hora"
          options={hoursOptions}
          onChange={(opt) => setHora(opt.value)}
          value={hoursOptions.find(opt => opt.value === hora)}
          placeholder={hora}
        />

        <SelectSearch
          label="Minuto"
          options={minutesOptions}
          value={minutesOptions.find(opt => opt.value === minuto)}
          onChange={(opt) => setMinuto(opt.value)}
          placeholder={initialMinutes}
        />

        <SelectSearch
          label="AM/PM"
          options={ampmOptions}
          value={ampmOptions.find(opt => opt.label === ampm)}
          onChange={(opt) => setAmPm(opt.label)}
          placeholder={ampm}
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
        placeholder={datos.categoria}
        className="mb-4"
      />

      <SelectSearch
        label="Lugar"
        options={lugares}
        value={lugar}
        onChange={setLugar}
        getOptionValue={l => l.id}
        getOptionLabel={l => l.nombre}
        placeholder={datos.lugar}
        className="mb-4"
      />
      <SelectSearch
        label="Local"
        options={equipos}
        value={local}
        onChange={setLocal}
        getOptionValue={e => e.id}
        getOptionLabel={e => e.nom_equipo}
        placeholder={datos.local}
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
        placeholder={datos.visitante}
      />

      <SelectSearch
        label="Torneo"
        options={torneos}
        value={torneo}
        onChange={setTorneo}
        getOptionValue={e => e.id}
        getOptionLabel={e => e.nombre_torneo}
        className="mb-4"
        placeholder={datos.visitante}
      />
    </ModalEditForm>
  );
};

export default ModalEditProgramacion;
