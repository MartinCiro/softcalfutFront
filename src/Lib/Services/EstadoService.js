import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const EstadoService = {
  endpoint: "estados",
  estados: async () => {
    const cacheKey = EstadoService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };
    
    try {
      const data = await getByEndpoint(EstadoService.endpoint);
      if (!data) throw new Error("No se recibieron estados.");
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener estados:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upEstado: async (data) => {
    try {
      const response = await getByEndpoint(
        EstadoService.endpoint,
        data,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crEstado: async (data) => {
    try {
      const response = await getByEndpoint(
        EstadoService.endpoint,
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

export default EstadoService;
