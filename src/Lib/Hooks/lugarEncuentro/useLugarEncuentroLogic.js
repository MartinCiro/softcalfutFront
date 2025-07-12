import { useState } from "react";
import useErrorHandler from "@hooks/useErrorHandler";
import LugarEncuentroService from "@services/LugarEncuentroService";

export const useLugarEncuentroLogic = (cargarLugarEncuentro) => {
  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [lugarEncuentroSeleccionado, setLugarEncuentroSeleccionado] = useState(null);
  const [lugarEncuentroVer, setLugarEncuentroVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  
  const { handleError } = useErrorHandler();

  const handleEditar = (lugarEncuentro) => {
    setModoEdicion(true);
    setLugarEncuentroSeleccionado(lugarEncuentro);
    setModalShow(true);
  };

  const handleVer = (lugarEncuentro) => {
    setLugarEncuentroVer(lugarEncuentro);
    setModalVer(true);
  };

  const guardarOActualizarLugarEncuentro = async (datosForm) => {
    const esEdicion = modoEdicion;
    if (!datosForm.nombre || !datosForm.direccion) {
      setErrorGuardar({ message: "Nombre y descripción son obligatorios", variant: "danger" });
      return;
    }
    try {
      setGuardando(true);
      esEdicion 
        ? await LugarEncuentroService.upLugarEncuentro(datosForm) 
        : await LugarEncuentroService.crLugarEncuentro(datosForm);
      
      sessionStorage.removeItem("lugarEncuentros");
      await cargarLugarEncuentro();
      setErrorGuardar({ 
        message: esEdicion ? "Lugar de encuentro actualizado correctamente" : "Lugar de encuentro creado correctamente", 
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
    lugarEncuentroStates: {
      lugarEncuentroSeleccionado: lugarEncuentroSeleccionado,
      lugarEncuentroVer,
      setLugarEncuentroSeleccionado,
      setLugarEncuentroVer,
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
      guardarOActualizarLugarEncuentro,
    },
  };
};