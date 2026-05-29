import { useState, useMemo, useEffect } from "react";

const ITEMS_PER_PAGE = 10;

export function usePagination<T>(items: T[]) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  // Clamp page when items change (e.g., filtered list shrinks)
  useEffect(() => {
    setPage((p) => Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return {
    page,
    totalPages,
    paginatedItems,
    goToPage,
  };
}