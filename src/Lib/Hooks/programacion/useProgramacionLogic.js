import { useState } from "react";
import useErrorHandler from "@hooks/useErrorHandler";
import ProgramacionService from "@services/ProgramacionService";

export const useProgramacionLogic = (cargarProgramacion) => {
  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [programacionSeleccionado, setProgramacionSeleccionado] = useState(null);
  const [programacionVer, setProgramacionVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  
  const { handleError } = useErrorHandler();

  const handleEditar = (programacion) => {
    setModoEdicion(true);
    setProgramacionSeleccionado(programacion);
    setModalShow(true);
  };

  const handleVer = (programacion) => {
    setProgramacionVer(programacion);
    setModalVer(true);
  };

  const guardarOActualizarProgramacion = async (datosForm) => {
    const esEdicion = modoEdicion;
    try {
      setGuardando(true);
      esEdicion 
        ? await ProgramacionService.upProgramacion(datosForm) 
        : await ProgramacionService.crProgramacion(datosForm);
      
      sessionStorage.removeItem("programacions");
      await cargarProgramacion();
      setErrorGuardar({ 
        message: esEdicion ? "Programacion actualizado correctamente" : "Programacion creado correctamente", 
        variant: "success" 
      });
      return true;
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
      return false;
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
    programacionStates: {
      programacionSeleccionado: programacionSeleccionado,
      programacionVer,
      setProgramacionSeleccionado,
      setProgramacionVer,
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
      guardarOActualizarProgramacion,
    },
  };
};