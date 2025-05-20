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

  upRol: async (data, id) => {
    try {
      const permisosPlanos = (data.permisos.permisos || []).flatMap(
        ({ entidad, permisos }) =>
          permisos.map((accion) => `${entidad}:${accion}`)
      );
      const nombre = data.permisos.nombre;
      const descripcion = data.permisos.descripcion;
      const id_permiso = parseInt(id);

      const dataFilter = {
        nombre,
        descripcion,
        permisos: permisosPlanos,
        id: id_permiso,
      };
      const response = await getByEndpoint(
        RolService.endpoint,
        dataFilter,
        "put"
      );
      return response;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  crRol: async (data) => {
    try {
    
      const permisosPlanos = data.permisos.flatMap(({ entidad, permisos }) =>
        permisos.map((permiso) => `${entidad}:${permiso}`)
      );
      const dataFilter = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        permisos: permisosPlanos,
      };

      const response = await getByEndpoint(
        RolService.endpoint,
        dataFilter,
        "post"
      );
      return response;
    } catch (error) {
      console.error("Error al crear rol:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },
};

export default RolService;
