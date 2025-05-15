import axios from 'axios';

// Configuración de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Configuración para reintentos
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // milisegundos

// Servicio para gestionar usuarios
const UsuarioService = {
  // Obtener todos los usuarios
  getUsuarios: async () => {
    return await withRetry(async () => {
      try {
        const response = await axios.get(`${API_URL}/usuarios/`);
        return response.data.result || response.data.data || response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        handleApiError(error);
      }
    });
  },

  // Obtener un usuario por ID
  getUsuario: async (id) => {
    return await withRetry(async () => {
      try {
        const response = await axios.get(`${API_URL}/usuarios/${id}/`);
        return response.data.result || response.data.data || response.data;
      } catch (error) {
        console.error(`Error al obtener usuario con ID ${id}:`, error);
        handleApiError(error);
      }
    });
  },

  // Crear un nuevo usuario
  createUsuario: async (usuarioData) => {
    return await withRetry(async () => {
      try {
        const response = await axios.post(`${API_URL}/usuarios/`, usuarioData);
        return response.data.result || response.data.data || response.data;
      } catch (error) {
        console.error('Error al crear usuario:', error);
        handleApiError(error);
      }
    });
  },

  // Actualizar un usuario existente
  updateUsuario: async (id, usuarioData) => {
    return await withRetry(async () => {
      try {
        const response = await axios.put(`${API_URL}/usuarios/${id}/`, usuarioData);
        return response.data.result || response.data.data || response.data;
      } catch (error) {
        console.error(`Error al actualizar usuario con ID ${id}:`, error);
        handleApiError(error);
      }
    });
  },

  // Eliminar un usuario
  deleteUsuario: async (id) => {
    return await withRetry(async () => {
      try {
        const response = await axios.delete(`${API_URL}/usuarios/${id}/`);
        return response.data.result || response.data.data || response.data;
      } catch (error) {
        console.error(`Error al eliminar usuario con ID ${id}:`, error);
        handleApiError(error);
      }
    });
  }
};

// Función para implementar reintentos en las operaciones de API
const withRetry = async (operation) => {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Verificar conexión a internet antes de cada intento
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }
      
      // Si no es el primer intento, esperar antes de reintentar
      if (attempt > 0) {
        console.log(`Reintentando operación (intento ${attempt} de ${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      
      // No reintentar si es un error de validación (400) o autenticación (401/403)
      if (error.response && (error.response.status === 400 || 
                            error.response.status === 401 || 
                            error.response.status === 403 || 
                            error.response.status === 409)) {
        break;
      }
      
      // Si es el último intento, no hacer nada y dejar que se propague el error
      if (attempt === MAX_RETRIES) {
        console.error(`Máximo número de reintentos (${MAX_RETRIES}) alcanzado.`);
      }
    }
  }
  
  // Si llegamos aquí, todos los intentos fallaron
  throw lastError;
};

// Función para manejar errores de API de manera consistente
const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    throw new Error('La conexión con el servidor ha tardado demasiado. Intente nuevamente.');
  } else if (!error.response && error.request) {
    throw new Error('No se pudo conectar con el servidor. Verifique su conexión a internet o que el servidor esté en funcionamiento.');
  } else if (error.response) {
    // Extraer mensaje de error del backend si existe
    const statusCode = error.response.status;
    let errorMsg;
    
    // Mensajes específicos según el código de estado HTTP
    if (statusCode === 400) {
      // Intentar extraer detalles de validación si existen
      const validationErrors = error.response.data?.errors || error.response.data?.detail;
      if (validationErrors && typeof validationErrors === 'object') {
        // Convertir errores de validación a texto legible
        errorMsg = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
      } else {
        errorMsg = error.response.data?.mensaje || 
                  error.response.data?.message || 
                  'Datos inválidos. Por favor verifique la información ingresada.';
      }
    } else if (statusCode === 401) {
      errorMsg = 'No autorizado. Por favor inicie sesión nuevamente.';
    } else if (statusCode === 403) {
      errorMsg = 'No tiene permisos para realizar esta operación.';
    } else if (statusCode === 404) {
      errorMsg = 'El recurso solicitado no fue encontrado.';
    } else if (statusCode === 409) {
      errorMsg = 'Conflicto con los datos existentes. Posiblemente el usuario ya existe.';
    } else if (statusCode === 500) {
      errorMsg = 'Error interno del servidor. Por favor contacte al administrador.';
    } else {
      errorMsg = error.response.data?.mensaje || 
                error.response.data?.message || 
                'Error en la operación. Intente nuevamente más tarde.';
    }
    
    // Registrar detalles adicionales para depuración
    console.error('Detalles del error:', {
      status: statusCode,
      url: error.config?.url,
      method: error.config?.method,
      responseData: error.response.data
    });
    
    throw new Error(errorMsg);
  } else {
    console.error('Error no manejado:', error);
    throw error;
  }
};

export default UsuarioService;