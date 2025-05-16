import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache
} from "@utils/helpers";

const RolService = {
  endpoint: "roles",
  roles: async () => {
    const cacheKey = RolService.endpoint;

    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint(RolService.endpoint);

      if (!data) throw new Error("No se recibieron roles.");

      cacheSession(cacheKey, data);
      return { result: data };
    } catch (error) {
      console.error("Error al obtener roles:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upRol: async (id, data) => {
    try {
      id = String(id);
      const estado = data.estado === 'Activo' ? true : false;
      const dataFilter = { ...data, id, nombre: data.titulo, estado };
      const response = await getByEndpoint(RolService.endpoint, dataFilter, 'put');
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crRol: async (data) => {
    try {
      data = { ...data, nombre: data.titulo };
      const response = await getByEndpoint(RolService.endpoint, data, 'post');
      return response;
    } catch (error) {
      console.error("Error al crear rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }
};

export default RolService;
