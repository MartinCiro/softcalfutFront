import { useState } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState('');

  const handleError = (err) => {
    console.error('Error capturado:', err);

    const handlers = [
      {
        condition: () => err.response,
        message: () =>
          err.response.data?.mensaje ||
          err.response.data?.message ||
          'Error en la solicitud. Verifique los datos enviados.',
      },
      {
        condition: () => err.request,
        message: () =>
          'No se pudo conectar con el servidor. Verifique su conexión a internet.',
      },
      {
        condition: () => err.message === 'Estructura de respuesta inválida',
        message: () =>
          'Error en la respuesta del servidor. Contacte al administrador.',
      },
      {
        condition: () => true, // catch-all
        message: () => 'Error desconocido. Intente nuevamente más tarde.',
      },
    ];

    const { message } = handlers.find((h) => h.condition());
    setError(message());
  };

  const resetError = () => setError('');

  return { error, handleError, resetError };
};

export default useErrorHandler;
