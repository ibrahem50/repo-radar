import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { selectTrackedRepos, selectTrackedRepoFullNames } from '@repo-radar/store';
import { useAppSelector } from '../app/hooks';
import { useTrackRepo } from '../features/track-repository/useTrackRepo';
import { RepoItem } from './RepoItem';
import { StatsChartWidget } from './StatsChartWidget';

export function TrackedRepoListWidget() {
  const trackedRepos = useAppSelector(selectTrackedRepos);
  const trackedFullNames = useAppSelector(selectTrackedRepoFullNames);
  const { toggleTrack } = useTrackRepo();
  const [refreshSignal, setRefreshSignal] = useState(0);

  if (trackedRepos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(0,204,204,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookmarkAddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" color="text.primary" gutterBottom>
            No repositories tracked yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Go to Search, find a repository, and hit "Track" to start monitoring it
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <StatsChartWidget trackedRepos={trackedRepos} />

      <Stack direction="row" justifyContent="flex-end">
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => setRefreshSignal((s) => s + 1)}
        >
          Refresh all
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 1.5,
        }}
      >
        {trackedRepos.map((repo) => (
          <RepoItem
            key={repo.fullName}
            repo={repo}
            isTracked={trackedFullNames.includes(repo.fullName)}
            onToggleTrack={toggleTrack}
            refreshSignal={refreshSignal}
          />
        ))}
      </Box>

    </Stack>
  );
}
