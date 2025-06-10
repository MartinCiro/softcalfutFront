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
    campo => !["eventos", "local", "visitante", "rama", "lugar"].includes(campo.nombre)
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

  const handleGuardar = (formData) => {/* 
    console.log("formData", formData);
    console.log("equipoA", equipoA);
    console.log("equipoB", equipoB);
    console.log("lugar", lugar);
    console.log("genero", genero); */
    onSubmit({
      ...formData,
      lugar: lugar?.id,
      equipo_a: equipoA?.id,
      equipo_b: equipoB?.id,
      rama: genero,
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
