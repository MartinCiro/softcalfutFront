import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const AfiliadoService = {
  endpoint: "afiliados",
  afiliados: async () => {
    const cacheKey = AfiliadoService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };
    
    try {
      const data = await getByEndpoint(AfiliadoService.endpoint);
      if (!data) throw new Error("No se recibieron afiliados.");
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener afiliados:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upAfiliado: async (data) => {
    try {
      const response = await getByEndpoint(
        AfiliadoService.endpoint,
        data,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar la afiliado:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  crAfiliado: async (data) => {
    try {
      const response = await getByEndpoint(
        AfiliadoService.endpoint,
        data,
        "post"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar la afiliado:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },
};

export default AfiliadoService;
