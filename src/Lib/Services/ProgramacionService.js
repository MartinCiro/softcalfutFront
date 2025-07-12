import {
  getFriendlyErrorMessage,
  getByEndpoint
} from "@utils/helpers";

const ProgramacionService = {
  endpoint: "programacion",
  programacion: async () => {
    try {
      const data = await getByEndpoint(ProgramacionService.endpoint);
      if (!data) {
        error.friendlyMessage = getFriendlyErrorMessage(error);
        throw error;
      }
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
