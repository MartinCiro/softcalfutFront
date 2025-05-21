import {
  getFriendlyErrorMessage,
  getByEndpoint,
  cacheSession,
  loadSessionCache,
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

      const permisosNormalizados = data.map((item) => {
        const { descripcion, ...entidadObj } = item;
        const [entidad] = Object.keys(entidadObj);
        return {
          entidad,
          permisos: entidadObj[entidad],
          descripcion,
        };
      });
      cacheSession(cacheKey, permisosNormalizados);

      return { result: permisosNormalizados };
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  upPermiso: async (data) => {
    try {
      const permisosPlanos = Object.entries(
        data.permisosSeleccionados || {}
      ).flatMap(([modulo, acciones]) =>
        acciones.map((accion) => `${modulo}:${accion}`)
      );
      const dataFilter = { ...data, permisos: permisosPlanos };
      const response = await getByEndpoint(
        PermisoService.endpoint,
        dataFilter,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crPermiso: async (data) => {
    try {
      const permisos = (data.permisosSeleccionados || []).map(
      (accion) => `${data.entidad}:${accion}`
    );
      const dataFilter = { ...data, permisos };
      const response = await getByEndpoint(
        PermisoService.endpoint,
        dataFilter,
        "post"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },
};

export default PermisoService;
