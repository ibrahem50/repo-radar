import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SearchBar } from '@repo-radar/ui';
import { useRepoSearch } from '../features/search-repositories/useRepoSearch';
import { useTrackRepo } from '../features/track-repository/useTrackRepo';
import { RepoListWidget } from '../widgets/RepoListWidget';

export function SearchPage() {
  const {
    query, setQuery,
    page, setPage,
    results, totalPages,
    isSearching, isError, searchError, hasQuery,
    refetchSearch,
  } = useRepoSearch();
  const { trackedFullNames, toggleTrack } = useTrackRepo();
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleRefreshAll = () => {
    refetchSearch();
    setRefreshSignal((s) => s + 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    setRefreshSignal(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Discover Repositories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Search GitHub to find and track open-source projects
        </Typography>
      </Box>
      <SearchBar value={query} onChange={setQuery} />
      {hasQuery && (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshAll}
            disabled={isSearching || results.length === 0}
          >
            Refresh all
          </Button>
        </Stack>
      )}
      <RepoListWidget
        results={results}
        isSearching={isSearching}
        isError={isError}
        searchError={searchError}
        hasQuery={hasQuery}
        trackedFullNames={trackedFullNames}
        onToggleTrack={toggleTrack}
        refreshSignal={refreshSignal}
        onRetrySearch={refetchSearch}
      />
      {hasQuery && totalPages > 1 && (
        <Stack alignItems="center" sx={{ pt: 1, pb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            disabled={isSearching}
          />
        </Stack>
      )}
    </Stack>
  );
}
