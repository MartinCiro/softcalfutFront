import {
  extractResponseData,
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache
} from "@utils/Utils";


const AnuncioService = {
  anuncios: async () => {
    const cacheKey = 'anuncios';

    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint('anuncios');

      if (!data) throw new Error("No se recibieron anuncios.");

      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener anuncios:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upAnuncio: async (id, data) => {
    try {
      id = String(id);
      const dataFilter = { ...data, id, nombre: data.titulo };
      const response = await getByEndpoint('anuncios', dataFilter, 'put');
      return response;
    } catch (error) {
      console.error("Error al actualizar anuncio:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }
};

export default AnuncioService;
