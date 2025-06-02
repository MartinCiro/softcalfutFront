import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const NotaService = {
  endpoint: "notas",
  notas: async () => {
    const cacheKey = NotaService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint(NotaService.endpoint);
      if (!data) {
        error.friendlyMessage = getFriendlyErrorMessage(error);
        throw error;
      }
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener notas:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upNota: async (data) => {
    try {
      const response = await getByEndpoint(NotaService.endpoint, data, "put");
      return response;
    } catch (error) {
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  crNota: async (data) => {
    try {
      const response = await getByEndpoint(
        NotaService.endpoint,
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

export default NotaService;
