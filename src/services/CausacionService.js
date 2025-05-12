import axios from 'axios';
import AuthService from './AuthService';

// Configuración de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const CausacionService = {
  /**
   * Obtiene la configuración de causación
   * @returns {Promise} Promesa con los datos de configuración
   */
  getCausacionConfig: async () => {
    try {
      // Verificar conexión a internet antes de intentar la solicitud
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      const response = await axios.get(`${API_URL}/api/configuracion/causacion/`, {
        headers: AuthService.getAuthHeader(),
        timeout: 5000 // Timeout de 5 segundos
      });
      
      if (response.data && response.data.result) {
        return response.data.result;
      } else {
        // Si no hay configuración guardada, devolver un objeto vacío
        return { campos: [] };
      }
    } catch (error) {
      console.error('Error al obtener configuración de causación:', error);
      // Si es un error 404, significa que no hay configuración guardada aún
      if (error.response && error.response.status === 404) {
        return { campos: [] };
      }
      throw error;
    }
  },

  /**
   * Guarda la configuración de causación
   * @param {Object} config - Configuración de causación a guardar
   * @returns {Promise} Promesa con el resultado de la operación
   */
  saveCausacionConfig: async (config) => {
    try {
      // Verificar conexión a internet antes de intentar la solicitud
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      // El backend espera un objeto con la propiedad 'campos'
      const response = await axios.post(`${API_URL}/api/configuracion/causacion/`, {
        campos: config
      }, {
        headers: AuthService.getAuthHeader(),
        timeout: 5000 // Timeout de 5 segundos
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al guardar configuración de causación:', error);
      throw error;
    }
  },

  /**
   * Procesa la causación de una factura
   * @param {string} facturaId - ID de la factura a procesar
   * @param {Object} datosCausacion - Datos de causación a procesar
   * @returns {Promise} Promesa con el resultado de la operación
   */
  procesarCausacion: async (facturaId, datosCausacion) => {
    try {
      // Verificar conexión a internet antes de intentar la solicitud
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      const response = await axios.post(`${API_URL}/api/facturas/${facturaId}/causacion/`, datosCausacion, {
        headers: AuthService.getAuthHeader(),
        timeout: 10000 // Timeout de 10 segundos
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al procesar causación de factura:', error);
      throw error;
    }
  },

  /**
   * Obtiene las llaves de retención disponibles
   * @returns {Promise} Promesa con los datos de las llaves de retención
   */
  getLlavesRetencion: async () => {
    try {
      // Verificar conexión a internet antes de intentar la solicitud
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      const response = await axios.get(`${API_URL}/api/maestro/llaves-retencion/`, {
        headers: AuthService.getAuthHeader(),
        timeout: 5000 // Timeout de 5 segundos
      });
      
      if (response.data && response.data.result) {
        return response.data.result;
      } else {
        // Si no hay llaves guardadas, devolver un array vacío
        return [];
      }
    } catch (error) {
      console.error('Error al obtener llaves de retención:', error);
      // Si es un error 404, significa que no hay llaves guardadas aún
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  }
};

export default CausacionService;