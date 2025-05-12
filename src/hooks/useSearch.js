import { useState, useEffect } from "react";

const useSearch = (data = [], key = "titulo") => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      data.filter((item) => item[key]?.toLowerCase().includes(q))
    );
  }, [query, data, key]);

  return { query, setQuery, filtered };
};

export default useSearch;
