import { useMemo, useState } from "react";

const useSearch = (data, campo) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return data.filter(item =>
      item[campo]?.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  return { query, setQuery, filtered };
};

export default useSearch;
