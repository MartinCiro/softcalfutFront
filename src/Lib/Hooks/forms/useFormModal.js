import { useState, useEffect } from "react";
import useErrorHandler from "@hooks/useErrorHandler";

export const useFormModal = ({ datos, campos, onChange }) => {
  const [formState, setFormState] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);
  const { error, handleError, resetError } = useErrorHandler();

  useEffect(() => {
    if (datos && Object.keys(datos).length > 0) {
      setFormState(datos);
    } else {
      // Inicializar con valores por defecto
      const initialState = {};
      campos.forEach((campo) => {
        if (campo.defaultValue !== undefined) {
          initialState[campo.nombre] = campo.defaultValue;
        }
      });
      setFormState(initialState);
    }
  }, [datos, campos]);

  const handleChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
    onChange?.(name, value);
  };

  const handleSubmit = async (onSubmit) => {
    if (!onSubmit) return;
    try {
      setGuardando(true);
      resetError();
      await onSubmit(formState);
      setMensajeExito("Operación exitosa");
    } catch (err) {
      handleError(err);
    } finally {
      setGuardando(false);
    }
  };

  const resetForm = () => {
    setMensajeExito(null);
    resetError();
  };

  return {
    formState,
    guardando,
    mensajeExito,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
