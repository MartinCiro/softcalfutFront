import { useState } from "react";

const useErrorHandler = () => {
  const [error, setError] = useState("");

  const handleError = (err) => {
    console.log(err);
    const handlers = [
      {
        condition: () => err.response,
        message: () => {
          const result = err.response.data?.result;
          const mensaje =
            err.response.data?.mensaje || err.response.data?.message || err.error;

          if (Array.isArray(result)) {
            // Es una lista de errores por campo
            return result
              .map((e) => `${e.campo}: ${e.mensaje}`)
              .join("\n");
          }

          return result || mensaje || "Error en la solicitud. Verifique los datos enviados.";
        },
      },
      {
        condition: () => err.request,
        message: () =>
          "No se pudo conectar con el servidor. Verifique su conexión a internet.",
      },
      {
        condition: () => err.message === "Estructura de respuesta inválida",
        message: () =>
          "Error en la respuesta del servidor. Contacte al administrador.",
      },
      {
        condition: () => true, // catch-all
        message: () => "Error desconocido. Intente nuevamente más tarde.",
      },
    ];

    const { message } = handlers.find((h) => h.condition());
    const finalMessage = message();
    setError(finalMessage);
    return finalMessage;
  };

  const resetError = () => setError("");

  return { error, handleError, resetError };
};

export default useErrorHandler;
