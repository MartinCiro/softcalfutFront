import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache
} from "@utils/helpers";

const PermisoService = {
  endpoint: "permisos",
  permisos: async () => {
    const cacheKey = PermisoService.endpoint;

    const cached = loadSessionCache(cacheKey);
    if (cached) return { result: cached };

    try {
      const data = await getByEndpoint(PermisoService.endpoint);

      if (!data) throw new Error("No se recibieron permisos.");
      const permisosNormalizados = Object.entries(data).map(([entidad, permisos]) => ({
        entidad,
        permisos,
      }));

      cacheSession(cacheKey, permisosNormalizados);
      
      return { result: permisosNormalizados };
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upPermiso: async (id, data) => {
    try {
      const permisosPlanos = Object.entries(data.permisos || {}).flatMap(
        ([modulo, acciones]) => acciones.map((accion) => `${modulo}:${accion}`)
      );
      const id = parseInt(id);
      const dataFilter = { ...data, permisos: permisosPlanos, id };
      const response = await getByEndpoint(PermisoService.endpoint, dataFilter, 'put');
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crPermiso: async (data) => {
    try {
      data = { ...data, nombre: data.titulo };
      const response = await getByEndpoint(PermisoService.endpoint, data, 'post');
      return response;
    } catch (error) {
      console.error("Error al crear rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }
};

export default PermisoService;
