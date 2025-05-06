import { useState } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState('');

  const handleError = (err) => {
    console.error('Error capturado:', err);

    if (err.response) {
      const mensaje = err.response.data?.mensaje || err.response.data?.message;
      setError(mensaje || 'Error en la solicitud. Verifique los datos enviados.');
    } else if (err.request) {
      setError('No se pudo conectar con el servidor. Verifique su conexión a internet.');
    } else if (err.message === 'Estructura de respuesta inválida') {
      setError('Error en la respuesta del servidor. Contacte al administrador.');
    } else {
      setError('Error desconocido. Intente nuevamente más tarde.');
    }
  };

  const resetError = () => {
    setError('');
  };

  return { error, handleError, resetError };
};

export default useErrorHandler;
