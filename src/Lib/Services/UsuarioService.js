import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
} from "@utils/helpers";

const UsuarioService = {
  endpoint: "usuarios",
  usuarios: async () => {
    const cacheKey = UsuarioService.endpoint;
    const cached = loadSessionCache(cacheKey);
    //if (cached) return { result: cached };
    
    try {
      const data = await getByEndpoint(UsuarioService.endpoint);
      if (!data) throw new Error("No se recibieron usuarios.");
      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upUsuario: async (data) => {
    try {
      const response = await getByEndpoint(
        UsuarioService.endpoint,
        data,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crUsuario: async (data) => {
    try {
      const response = await getByEndpoint(
        UsuarioService.endpoint,
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

export default UsuarioService;
