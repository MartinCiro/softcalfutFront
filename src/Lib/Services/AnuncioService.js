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
      id = String(id);
      const estado = data.estado === "Activo" ? true : false;
      const dataFilter = { ...data, id, nombre: data.titulo, estado };
      const response = await getByEndpoint("anuncios", dataFilter, "put");
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
      console.log(dataToSend);
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
