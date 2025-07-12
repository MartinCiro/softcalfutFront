import {
  extractResponseData,
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const AnuncioService = {
  anuncios: async () => {
    const cacheKey = "anuncios";

    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint("anuncios");

      if (!data) throw new Error("No se recibieron anuncios.");

      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener anuncios:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upAnuncio: async (id, data) => {
  try {
    const isFormData = data instanceof FormData;
    let dataToSend;

    if (isFormData) {
      // Manejo de FormData
      data.append('id', String(id));
      
      // Convertir estado a booleano string
      if (data.has('estado')) {
        const estado = data.get('estado') === "Activo" ? 'true' : 'false';
        data.set('estado', estado);
      }
      
      // Solo incluir imagenUrl si existe
      if (!data.has('imagenUrl')) {
        data.delete('imagenUrl'); // Eliminar si está vacío
      }
      if (data.has('titulo')) {
        data.set('nombre', data.get('titulo'));
      }
      
      dataToSend = data;
    } else {
      // Manejo de objeto normal
      dataToSend = new FormData();
      dataToSend.append('id', String(id));
      dataToSend.append('nombre', data.titulo || '');
      dataToSend.append('contenido', data.contenido || '');
      dataToSend.append('estado', data.estado === "Activo" ? 'true' : 'false');
      
      if (data.imagenUrl instanceof File) {
        dataToSend.append('imagenUrl', data.imagenUrl);
      }
    }

    // Debug: Verificar datos
    /* console.log('Datos a enviar:');
    dataToSend.forEach((value, key) => console.log(key, value)); */

    const response = await getByEndpoint(
      "anuncios", 
      dataToSend, 
      "put", 
      true 
    );
    sessionStorage.removeItem("anuncios");
    return response;
  } catch (error) {
    console.error("Error al actualizar anuncio:", error);
    error.friendlyMessage = getFriendlyErrorMessage(error);
    throw error;
  }
},

  crAnuncio: async (data) => {
    try {
      const isFormData = data instanceof FormData;
      let dataToSend;

      if (isFormData) {
        data.append("nombre", data.get("titulo"));
        dataToSend = data;
      } else {
        dataToSend = { ...data, nombre: data.titulo };
      }
      const response = await getByEndpoint(
        "anuncios",
        dataToSend,
        "post",
        isFormData
      );
      return response;
    } catch (error) {
      console.error("Error al crear anuncio:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },
};

export default AnuncioService;
