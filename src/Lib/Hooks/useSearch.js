import { useMemo, useState } from "react";

const useSearch = (data, campos) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return data.filter((item) =>
      campos.some((campo) =>
        item[campo]?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [data, query, campos]);

  return { query, setQuery, filtered };
};

export default useSearch;
