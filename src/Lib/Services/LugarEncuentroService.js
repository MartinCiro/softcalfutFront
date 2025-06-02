import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const LugarEncuentroService = {
  endpoint: "lugarEncuentro",
  lugarEncuentro: async () => {
    const cacheKey = LugarEncuentroService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint(LugarEncuentroService.endpoint);
      if (!data) {
        error.friendlyMessage = getFriendlyErrorMessage(error);
        throw error;
      }
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener el lugar de Encuentro:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upLugarEncuentro: async (data) => {
    try {
      const response = await getByEndpoint(LugarEncuentroService.endpoint, data, "put");
      return response;
    } catch (error) {
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  crLugarEncuentro: async (data) => {
    try {
      const response = await getByEndpoint(
        LugarEncuentroService.endpoint,
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

export default LugarEncuentroService;
