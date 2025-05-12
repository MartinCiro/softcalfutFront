import axios from "axios";
import AuthService from "@services/AuthService";
import { getByEndpoint, getFriendlyErrorMessage, dateFormatter } from "@utils/Utils";

// Configuración de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const FacturaService = {
  /**
   * Obtiene un NIT por su UUID
   * @param {string} uuid - UUID del NIT a obtener
   * @returns {Promise} Promesa con los datos del NIT
   */
  getNitById: async (uuid) => {
    try {
      console.log(uuid);
      const datos = await getByEndpoint(`nit/${uuid}/`);
      console.log(datos);
    } catch (error) {
      console.error("Error al traer datos:", error);
      throw error;
    }
  },

  /**
   * Obtiene un Producto por su UUID
   * @param {string} uuid - UUID del Producto a obtener
   * @returns {Promise} Promesa con los datos del Producto
   */
  getProductoById: async (uuid) => {
    try {
      // Verificar conexión a internet antes de intentar la solicitud
      if (!navigator.onLine) {
        throw new Error(
          "No hay conexión a internet. Por favor, verifique su conexión."
        );
      }

      const response = await axios.get(`${API_URL}/producto/${uuid}/`, {
        headers: AuthService.getAuthHeader(),
        timeout: 5000, // Timeout de 5 segundos
      });

      if (response && response.result) {
        return response.result;
      } else {
        throw new Error("No se pudo obtener la información del Producto");
      }
    } catch (error) {
      console.error("Error al obtener Producto por UUID:", error);
      throw error;
    }
  },

  /**
   * Obtiene todas las facturas desde el backend
   * @returns {Promise} Promesa con los datos de las facturas
   */
  getFacturas: async () => {
    try {
      const response = await getByEndpoint(`factura`);

      // El backend devuelve los datos en response.result según la estructura del API
      if (response.length > 0 && typeof response[0] === "object") {
        // Transformar los datos de facturas para que coincidan con la estructura esperada por el componente
        const facturas = response.map((factura) => {
          const fechaEmisionFormateada = new Date(factura.fecha_emision).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          const {
            FEV,
            nit_vendedor,
            razon_social_vendedor,
            estado,
            uuid,
            valor_total,
            ...rest
          } = factura;

          return {
            id: uuid,
            numero: FEV || "Sin número",
            fecha: fechaEmisionFormateada,
            nitVendedor: nit_vendedor || "",
            razonSocialVendedor: razon_social_vendedor || "Sin razón social asociada",
            monto: parseFloat(valor_total) || 0,
            estado: estado || "Pendiente",
            uuid: uuid || "",
            ...rest,
          };
        });

        return facturas;
      } else {
        throw new Error("Estructura de respuesta inválida");
      }
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  /**
   * Obtiene los detalles de una factura específica por su ID
   * @param {string} facturaId - ID de la factura
   * @returns {Promise<Object>} Datos de la factura
   */
  getFacturaById: async (facturaId) => {
    try {
      const facturaData = await getByEndpoint(`factura/${facturaId}`);
      const {
        fecha_emision,
        fecha_vencimiento
      } = facturaData;

      facturaData.fecha_emision = dateFormatter(fecha_emision);
      facturaData.fecha_vencimiento = dateFormatter(fecha_vencimiento)
      return facturaData;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  /**
   * Obtiene el PDF de una factura específica
   * @param {string} facturaId - ID de la factura
   * @returns {Promise<string>} URL del PDF de la factura
   */
  getFacturaPDF: async (pdfBase64) => {
    try {
      if (!pdfBase64) throw new Error("Esta factura no tiene un PDF asociado");

      // Crear una URL de datos para el PDF en base64
      // Asegurarse de que el string base64 tenga el prefijo correcto
      const base64Clean = pdfBase64.replace(/\s/g, "");
      return `data:application/pdf;base64,${base64Clean}`;
    } catch (error) {
      console.error("Error al obtener PDF de la factura:", error);

      throw new Error(getFriendlyErrorMessage(error, "Error al obtener el PDF de la factura. Intente nuevamente más tarde."));
    }
  },
  /**
   * Actualiza una factura existente
   * @param {string} facturaId - ID de la factura a actualizar
   * @param {Object} facturaData - Datos actualizados de la factura
   * @returns {Promise<Object>} Datos de la factura actualizada
   */
  updateFactura: async (facturaId, facturaData) => {
    try {
      // Verificar conexión a internet
      if (!navigator.onLine) {
        throw new Error(
          "No hay conexión a internet. Por favor, verifique su conexión."
        );
      }

      const response = await axios.put(
        `${API_URL}/facturas/${facturaId}/`,
        facturaData,
        {
          headers: AuthService.getAuthHeader(),
          timeout: 10000, // 10 segundos de timeout
        }
      );

      // Verificar si la respuesta contiene los datos de la factura actualizada
      if (!response || !response.result) {
        throw new Error("No se pudo actualizar la factura");
      }

      return response.result;
    } catch (error) {
      console.error("Error al actualizar la factura:", error);

      if (error.code === "ECONNABORTED") {
        throw new Error(
          "La conexión con el servidor ha tardado demasiado. Intente nuevamente."
        );
      } else if (!error.response && error.request) {
        throw new Error(
          "No se pudo conectar con el servidor. Verifique su conexión a internet."
        );
      } else if (error.response) {
        const errorMsg =
          error.response?.mensaje ||
          error.response?.message ||
          "Error al actualizar la factura. Intente nuevamente más tarde.";
        throw new Error(errorMsg);
      }

      throw error;
    }
  },

  /**
   * Sube un archivo XML de factura al servidor
   * @param {string} xmlString - Contenido del archivo XML
   * @returns {Promise<Object>} Resultado de la operación
   */
  uploadFacturaXML: async (xmlString) => {
    try {
      // Verificar conexión a internet
      if (!navigator.onLine) {
        throw new Error(
          "No hay conexión a internet. Por favor, verifique su conexión."
        );
      }

      const response = await axios.post(
        `${API_URL}/facturas/upload-xml/`,
        { xml_content: xmlString },
        { headers: AuthService.getAuthHeader() }
      );

      return response;
    } catch (error) {
      console.error("Error al subir el XML:", error);

      if (
        error.response &&
        error.response &&
        error.response.mensaje
      ) {
        throw new Error(error.response.mensaje);
      }

      throw new Error(
        "Error al procesar el archivo XML. Por favor, verifique el formato e intente nuevamente."
      );
    }
  },
};

export default FacturaService;
