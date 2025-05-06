import axios from 'axios';

// Usamos el proxy configurado en vite.config.js para evitar problemas de CORS
const SIESA_API_URL = '/api/siesa';
const CONNI_KEY = 'Connikey-laestrellasa-TDRONEQX';
const CONNI_TOKEN = 'TDRONEQXWDHLM0MWSDJSNLG4RDFBMFA1UTVVN1A1TDNZOFE1RJFQNQ';

const SiesaService = {
  /**
   * Ejecuta una consulta en SIESA Cloud
   * @param {string} descripcion - Descripción de la consulta (ej: 'MAESTRO_CO')
   * @param {number} idCompania - ID de la compañía
   * @returns {Promise<Array>} Resultado de la consulta
   */
  ejecutarConsulta: async (descripcion, idCompania = 6413) => {
    try {
      const response = await axios.get(
        `${SIESA_API_URL}/ejecutarconsulta`, 
        {
          params: {
            idCompania,
            descripcion
          },
          headers: {
            'conniKey': CONNI_KEY,
            'conniToken': CONNI_TOKEN
          }
        }
      );
      
      // Verificar si la respuesta es una cadena JSON y convertirla a objeto
      let data = response.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
          console.log('Respuesta convertida de cadena JSON a objeto:', data);
        } catch (parseError) {
          console.error('Error al analizar la respuesta JSON:', parseError);
          // Si hay error al parsear, mantener la respuesta original
        }
      }
      
      return data;
    } catch (error) {
      console.error(`Error al ejecutar consulta ${descripcion}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtiene el maestro de centros operativos (CO)
   * @returns {Promise<Array>} Lista de centros operativos
   */
  obtenerMaestroCO: async () => {
    try {
      const respuesta = await SiesaService.ejecutarConsulta('MAESTRO_CO');
      
      // Extraer los datos según el formato de respuesta
      let datos = [];
      
      // Verificar si la respuesta tiene el nuevo formato {codigo, mensaje, detalle}
      if (respuesta && respuesta.codigo === 0 && respuesta.detalle) {
        datos = respuesta.detalle;
      } else if (Array.isArray(respuesta)) {
        // Formato antiguo: la respuesta es directamente un array
        datos = respuesta;
      } else {
        console.error('El formato de respuesta de MAESTRO_CO no es válido:', respuesta);
        // En caso de formato no reconocido, devolver un valor por defecto
        return [{ valor: '099', etiqueta: '099 - Centro Operativo por defecto' }];
      }
      
      // Verificar si los datos extraídos son un array
      if (Array.isArray(datos)) {
        return datos.map(item => ({
          valor: item.ID || item.CODIGO || '',
          etiqueta: `${item.ID || item.CODIGO || ''} - ${item.DESCRIPCION || item.NOMBRE || ''}`,
          datos: item // Guardamos todos los datos por si se necesitan después
        }));
      } else {
        console.error('Los datos extraídos de MAESTRO_CO no son un array:', datos);
        // En caso de que no sea un array, devolver un valor por defecto
        return [{ valor: '099', etiqueta: '099 - Centro Operativo por defecto' }];
      }
    } catch (error) {
      console.error('Error al obtener maestro CO:', error);
      // En caso de error, devolver un valor por defecto
      return [{ valor: '099', etiqueta: '099 - Centro Operativo por defecto' }];
    }
  }
};

export default SiesaService;