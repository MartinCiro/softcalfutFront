import { useState } from "react";
import useErrorHandler from "@hooks/useErrorHandler";
import EquipoService from "@services/EquipoService";

export const useEquiposLogic = (cargarEquipos) => {
  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [equipoVer, setEquipoVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  
  const { handleError } = useErrorHandler();

  const handleEditar = (equipo) => {
    setModoEdicion(true);
    setEquipoSeleccionado(equipo);
    setModalShow(true);
  };

  const handleVer = (equipo) => {
    setEquipoVer(equipo);
    setModalVer(true);
  };

  const guardarOActualizarEquipo = async (datosForm) => {
    const esEdicion = modoEdicion;
    const datosTransformados = {
      ...datosForm,
      nombre: datosForm.nombre_equipo,
    };
    delete datosTransformados.nombre_equipo;
    
    try {
      setGuardando(true);
      esEdicion 
        ? await EquipoService.upEquipo(datosTransformados) 
        : await EquipoService.crEquipo(datosTransformados);
      
      sessionStorage.removeItem("equipos");
      await cargarEquipos();
      setErrorGuardar({ 
        message: esEdicion ? "Equipo actualizado correctamente" : "Equipo creado correctamente", 
        variant: "success" 
      });
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 3000);
      setGuardando(false);
      setModoEdicion(false);
    }
  };

  return {
    modalStates: {
      modalVer,
      modalShow,
      modalCrearShow,
      setModalVer,
      setModalShow,
      setModalCrearShow,
    },
    equipoStates: {
      equipoSeleccionado: equipoSeleccionado,
      equipoVer,
      setEquipoSeleccionado,
      setEquipoVer,
    },
    flags: {
      guardando,
      modoEdicion,
      setModoEdicion,
    },
    errorGuardar,
    handlers: {
      handleEditar,
      handleVer,
      guardarOActualizarEquipo,
    },
  };
};