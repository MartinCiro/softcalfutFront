import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const ProgramacionService = {
  endpoint: "programacion",
  programacion: async () => {
    const cacheKey = ProgramacionService.endpoint;
    const cached = loadSessionCache(cacheKey);
    //if (cached) return { result: cached };

    try {
      const data = await getByEndpoint(ProgramacionService.endpoint);
      if (!data) {
        error.friendlyMessage = getFriendlyErrorMessage(error);
        throw error;
      }
      cacheSession(cacheKey, data);
      console.log(data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener programacion:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upProgramacion: async (data) => {
    try {
      const response = await getByEndpoint(ProgramacionService.endpoint, data, "put");
      return response;
    } catch (error) {
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  crProgramacion: async (data) => {
    try {
      const response = await getByEndpoint(
        ProgramacionService.endpoint,
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

export default ProgramacionService;
