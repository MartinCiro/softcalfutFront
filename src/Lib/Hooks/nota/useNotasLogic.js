import { useState } from "react";
import useErrorHandler from "@hooks/useErrorHandler";
import NotaService from "@services/NotaService";

export const useNotasLogic = (cargarNotas) => {
  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [notaSeleccionado, setNotaSeleccionado] = useState(null);
  const [notaVer, setNotaVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  
  const { handleError } = useErrorHandler();

  const handleEditar = (nota) => {
    setModoEdicion(true);
    setNotaSeleccionado(nota);
    setModalShow(true);
  };

  const handleVer = (nota) => {
    setNotaVer(nota);
    setModalVer(true);
  };

  const guardarOActualizarNota = async (datosForm) => {
    const esEdicion = modoEdicion;
    if (!datosForm.nombre || !datosForm.descripcion) {
      setErrorGuardar({ message: "Nombre y descripción son obligatorios", variant: "danger" });
      return;
    }
    try {
      setGuardando(true);
      esEdicion 
        ? await NotaService.upNota(datosForm) 
        : await NotaService.crNota(datosForm);
      
      sessionStorage.removeItem("notas");
      await cargarNotas();
      setErrorGuardar({ 
        message: esEdicion ? "Nota actualizado correctamente" : "Nota creado correctamente", 
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
    notaStates: {
      notaSeleccionado: notaSeleccionado,
      notaVer,
      setNotaSeleccionado,
      setNotaVer,
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
      guardarOActualizarNota,
    },
  };
};