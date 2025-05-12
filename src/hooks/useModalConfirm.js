import { useState } from "react";

const useModalConfirm = () => {
  const [show, setShow] = useState(false);
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [mensaje, setMensaje] = useState("");

  const open = (mensaje, callback) => {
    setMensaje(mensaje);
    setOnConfirm(() => () => {
      callback();
      setShow(false);
    });
    setShow(true);
  };

  const close = () => setShow(false);

  return {
    show,
    mensaje,
    onConfirm,
    open,
    close,
  };
};

export default useModalConfirm;
