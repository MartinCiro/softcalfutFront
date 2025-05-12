import axios from 'axios';
import AuthService from './AuthService';

// Configuración de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const ConfiguracionService = {
  /**
   * Obtiene la configuración de causación para un tipo de documento específico
   * @param {string} tipoDocumento - Tipo de documento (ej: 'DocumentoCompraServicios')
   * @returns {Promise<Object>} Configuración de causación
   */
  getConfiguracionCausacion: async (tipoDocumento) => {
    try {
      // Verificar conexión a internet
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      // Intentar obtener la configuración del backend
      try {
        const response = await axios.get(`${API_URL}/api/configuracion/causacion/${tipoDocumento}/`, {
          headers: AuthService.getAuthHeader(),
          timeout: 5000
        });
        
        if (response.data && response.data.result) {
          return response.data.result;
        }
      } catch (error) {
        console.warn(`No se pudo obtener la configuración del backend: ${error.message}`);
        // Si falla, usar la configuración predeterminada
      }
      
      // Configuraciones predeterminadas por tipo de documento
      const configuracionesPredeterminadas = {
        DocumentoCompraServicios: {
          Doctocompraservicios: {
            F_CIA: {
              valor: "001",
              mostrar: true,
              bloqueado: false,
              descripcion: "Código de compañía"
            },
            F_LIQUIDA_IMPUESTO: {
              valor: "",
              mostrar: true,
              bloqueado: false,
              descripcion: "Liquidar impuesto (0=No, 1=Sí)",
              opciones: [
                { valor: "0", etiqueta: "No" },
                { valor: "1", etiqueta: "Sí" }
              ]
            },
            F_LIQUIDA_RETENCION: {
              valor: "0",
              mostrar: true,
              bloqueado: false,
              descripcion: "Liquidar retención (0=No, 1=Sí)",
              opciones: [
                { valor: "0", etiqueta: "No" },
                { valor: "1", etiqueta: "Sí" }
              ]
            },
            F_CONSEC_AUTO_REG: {
              valor: "1",
              mostrar: true,
              bloqueado: false,
              descripcion: "Consecutivo (0=Manual, 1=Automático)",
              opciones: [
                { valor: "0", etiqueta: "Manual" },
                { valor: "1", etiqueta: "Automático" }
              ]
            }
            // Otros campos según sea necesario
          }
        }
        // Otras configuraciones para diferentes tipos de documentos
      };
      
      return configuracionesPredeterminadas[tipoDocumento] || {};
    } catch (error) {
      console.error('Error al obtener configuración de causación:', error);
      throw error;
    }
  },
  
  /**
   * Guarda la configuración de causación para un tipo de documento específico
   * @param {string} tipoDocumento - Tipo de documento
   * @param {Object} configuracion - Configuración a guardar
   * @returns {Promise<Object>} Resultado de la operación
   */
  saveConfiguracionCausacion: async (tipoDocumento, configuracion) => {
    try {
      // Verificar conexión a internet
      if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión.');
      }

      // Intentar guardar en el backend
      try {
        const response = await axios.post(`${API_URL}/api/configuracion/causacion/${tipoDocumento}/`, 
          { configuracion },
          { 
            headers: AuthService.getAuthHeader(),
            timeout: 5000
          }
        );
        
        if (response.data && response.data.success) {
          return response.data;
        }
      } catch (error) {
        console.warn(`No se pudo guardar la configuración en el backend: ${error.message}`);
        // Si falla, guardar localmente
      }
      
      // Guardar en localStorage como respaldo
      localStorage.setItem(`configuracionCausacion_${tipoDocumento}`, JSON.stringify(configuracion));
      
      return { success: true, message: 'Configuración guardada localmente' };
    } catch (error) {
      console.error('Error al guardar configuración de causación:', error);
      throw error;
    }
  }
};

export default ConfiguracionService;