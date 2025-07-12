import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const EquipoService = {
  endpoint: "equipos",
  equipos: async () => {
    const cacheKey = EquipoService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint(EquipoService.endpoint);
      if (!data) throw new Error("No se recibieron equipos.");
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener equipos:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upEquipo: async (data) => {
    try {
      const response = await getByEndpoint(EquipoService.endpoint, data, "put");
      return response;
    } catch (error) {
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  crEquipo: async (data) => {
    try {
      const response = await getByEndpoint(
        EquipoService.endpoint,
        data,
        "post"
      );
      return response;
    } catch (error) {
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },
};

export default EquipoService;
