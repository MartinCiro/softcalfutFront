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
  datos = {},
  onSubmit,
  loading,
}) => {/* 
  console.log("equipos", equipos);
  console.log("lugares", lugares);
  console.log("datos", datos); */
  const camposFiltrados = camposProgramacion.filter(
    campo => !["eventos", "local", "visitante", "rama", "lugar", "dia", "hora"].includes(campo.nombre)
  );
  const [genero, setGenero] = useState(datos.rama || "M");

  const [equipoA, setEquipoA] = useState(
    equipos.find(e => e.nom_equipo === datos.local) || null
  );

  const [equipoB, setEquipoB] = useState(
    equipos.find(e => e.nom_equipo === datos.visitante) || null
  );

  const [lugar, setLugar] = useState(
    lugares.find(l => l.nombre === datos.lugar) || null
  );



  const handleGuardar = (formData) => {
    onSubmit({
      ...formData,
      lugar: lugar?.id,
      equipo_a: equipoA?.id,
      equipo_b: equipoB?.id,
      rama: genero,
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
        value={equipoA}
        onChange={setEquipoA}
        getOptionValue={e => e.id}
        getOptionLabel={e => e.nom_equipo}
        placeholder={datos.local}
        className="mb-4"
      />

      <SelectSearch
        label="Visitante"
        options={equipos}
        value={equipoB}
        onChange={setEquipoB}
        getOptionValue={e => e.id}
        getOptionLabel={e => e.nom_equipo}
        className="mb-4"
        placeholder={datos.visitante}
      />


    </ModalEditForm>
  );
};

export default ModalEditProgramacion;
