import { useEffect, useState } from "react";
const useFetchData = (fetchFunction, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { result } = await fetchFunction();
      if (Array.isArray(result)) {
        setData(result.map(item => ({ ...item })));
      } else {
        setData([]);
        setError(result || "No se recibieron datos.");
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, deps);

  return { data, loading, error, reload: cargarDatos };
};

export default useFetchData;