import axios from 'axios';
import AuthService from './AuthService';

// Configuración de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const ClienteService = {
  /**
   * Obtiene todos los clientes desde el backend
   * @returns {Promise} Promesa con los datos de los clientes
   */
  getClientes: async () => {
    try {
      // Verificar conexión a internet antes de intentar la solicitud
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      // Obtenemos los NITs que tienen relación con razones sociales (clientes)
      const response = await axios.get(`${API_URL}/api/nit/`, {
        headers: AuthService.getAuthHeader(),
        timeout: 10000 // Timeout de 10 segundos
      });
      
      // El backend devuelve los datos en response.data.result según la estructura del API
      if (response.data && response.data.result) {
        // Transformar los datos de NITs para que coincidan con la estructura esperada por el componente
        const clientes = Array.isArray(response.data.result) ? response.data.result.map(nit => {
          return {
            id: nit.uuid,
            nit: nit.nit,
            razonSocial: nit.razon_social,
            tipoTributacion: nit.tipo_tributacion || 'No especificado'
          };
        }) : [];
        
        return clientes;
      } else {
        console.error('Estructura de respuesta:', response.data);
        throw new Error('Estructura de respuesta inválida');
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      
      // Mejorar los mensajes de error para el usuario
      if (error.code === 'ECONNABORTED') {
        throw new Error('La conexión con el servidor ha tardado demasiado. Intente nuevamente.');
      } else if (!error.response && error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifique su conexión a internet o que el servidor esté en funcionamiento.');
      } else if (error.response) {
        // Extraer mensaje de error del backend si existe
        const errorMsg = error.response.data?.mensaje || 
                         error.response.data?.message || 
                         'Error al obtener los clientes. Intente nuevamente más tarde.';
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  /**
   * Obtiene un cliente específico por su ID
   * @param {string} id - ID del cliente a obtener
   * @returns {Promise} Promesa con los datos del cliente
   */
  getClienteById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/nit/${id}/`, {
        headers: AuthService.getAuthHeader(),
        timeout: 10000
      });
      
      if (response.data && response.data.result) {
        const nit = response.data.result;
        return {
          id: nit.uuid,
          nit: nit.nit,
          razonSocial: nit.razon_social,
          tipoTributacion: nit.tipo_tributacion || 'No especificado'
        };
      } else {
        throw new Error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener cliente por ID:', error);
      throw new Error(error.response?.data?.mensaje || 'Error al obtener el cliente');
    }
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} clienteData - Datos del cliente a crear
   * @returns {Promise} Promesa con los datos del cliente creado
   */
  createCliente: async (clienteData) => {
    try {
      // Transformar datos al formato esperado por el backend
      const payload = {
        nit: clienteData.nit,
        razon_social: clienteData.razonSocial,
        tipo_tributacion: clienteData.tipoTributacion
      };

      const response = await axios.post(`${API_URL}/api/nit/`, payload, {
        headers: AuthService.getAuthHeader(),
        timeout: 15000
      });

      if (response.data && response.data.result) {
        const nit = response.data.result;
        return {
          id: nit.uuid,
          nit: nit.nit,
          razonSocial: nit.razon_social,
          tipoTributacion: nit.tipo_tributacion || 'No especificado'
        };
      } else {
        throw new Error('Error al crear el cliente');
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw new Error(error.response?.data?.mensaje || 'Error al crear el cliente');
    }
  },

  /**
   * Actualiza un cliente existente
   * @param {string} id - ID del cliente a actualizar
   * @param {Object} clienteData - Nuevos datos del cliente
   * @returns {Promise} Promesa con los datos del cliente actualizado
   */
  updateCliente: async (id, clienteData) => {
    try {
      // Transformar datos al formato esperado por el backend
      const payload = {
        razon_social: clienteData.razonSocial,
        tipo_tributacion: clienteData.tipoTributacion
      };

      const response = await axios.patch(`${API_URL}/api/nit/${id}/`, payload, {
        headers: AuthService.getAuthHeader(),
        timeout: 15000
      });

      if (response.data && response.data.result) {
        const nit = response.data.result;
        return {
          id: nit.uuid,
          nit: nit.nit,
          razonSocial: nit.razon_social,
          tipoTributacion: nit.tipo_tributacion || 'No especificado'
        };
      } else {
        throw new Error('Error al actualizar el cliente');
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw new Error(error.response?.data?.mensaje || 'Error al actualizar el cliente');
    }
  },

  /**
   * Elimina un cliente
   * @param {string} id - ID del cliente a eliminar
   * @returns {Promise} Promesa con el resultado de la eliminación
   */
  deleteCliente: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/nit/${id}/`, {
        headers: AuthService.getAuthHeader(),
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw new Error(error.response?.data?.mensaje || 'Error al eliminar el cliente');
    }
  }
};

export default ClienteService;