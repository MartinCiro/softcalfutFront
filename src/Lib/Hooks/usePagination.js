import { useState, useMemo, useEffect } from "react";

const usePagination = (data = [], itemsPerPage = 6) => {
  const [currentPage, setCurrentPage] = useState(1);
  const shouldShowPaginator = data.length > itemsPerPage;

  const maxPage = Math.ceil(data.length / itemsPerPage);

  // Reiniciar la página si la data cambia o si la página actual supera maxPage
  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [data, currentPage, maxPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const dataRestante = data.length - currentPage * itemsPerPage;

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, maxPage));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, maxPage)));

  return {
    paginatedData,
    currentPage,
    maxPage,
    nextPage,
    prevPage,
    goToPage,
    dataRestante,
    shouldShowPaginator,
  };
};

export default usePagination;
