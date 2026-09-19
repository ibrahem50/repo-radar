import { useState, useEffect } from "react";
import { useSearchReposQuery } from "@repo-radar/github-api";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";

const PER_PAGE = 12;

export function useRepoSearch() {
  const [query, setQuery] = useState("typescript");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(query, 400);

  // Reset to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isFetching, isError, refetch } = useSearchReposQuery(
    { query: debouncedQuery, page },
    { skip: debouncedQuery.trim().length === 0 },
  );

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return {
    query,
    setQuery,
    page,
    setPage,
    results: data?.items ?? [],
    totalPages,
    totalCount,
    isSearching: isFetching,
    isError,
    hasQuery: debouncedQuery.trim().length > 0,
    refetchSearch: refetch,
  };
}
