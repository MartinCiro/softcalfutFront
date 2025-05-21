import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const TorneoService = {
  endpoint: "torneos",
  torneos: async () => {
    const cacheKey = TorneoService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };
    
    try {
      const data = await getByEndpoint(TorneoService.endpoint);
      if (!data) throw new Error("No se recibieron torneos.");
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener torneos:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upTorneo: async (data) => {
    try {
      const response = await getByEndpoint(
        TorneoService.endpoint,
        data,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crTorneo: async (data) => {
    try {
      const response = await getByEndpoint(
        TorneoService.endpoint,
        data,
        "post"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },
};

export default TorneoService;
