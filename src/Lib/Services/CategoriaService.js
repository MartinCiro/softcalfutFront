import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const CategoriaService = {
  endpoint: "categorias",
  categorias: async () => {
    const cacheKey = CategoriaService.endpoint;
    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };
    
    try {
      const data = await getByEndpoint(CategoriaService.endpoint);
      if (!data) throw new Error("No se recibieron categorias.");
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener categorias:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  upCategoria: async (data) => {
    try {
      const response = await getByEndpoint(
        CategoriaService.endpoint,
        data,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },

  crCategoria: async (data) => {
    try {
      const response = await getByEndpoint(
        CategoriaService.endpoint,
        data,
        "post"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      error.friendlyMessage = getFriendlyErrorMessage(error);
      throw error;
    }
  },
};

export default CategoriaService;
