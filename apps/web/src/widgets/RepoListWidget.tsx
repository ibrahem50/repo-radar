import { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { ErrorState, RepoCardSkeleton } from '@repo-radar/ui';
import type { RepoSummary } from '@repo-radar/github-api';
import { RepoItem } from './RepoItem';

const SKELETONS = Array.from({ length: 12 }, (_, i) => i);

export interface RepoListWidgetProps {
  results: RepoSummary[];
  isSearching: boolean;
  isError: boolean;
  hasQuery: boolean;
  trackedFullNames: string[];
  onToggleTrack: (repo: RepoSummary) => void;
  refreshSignal: number;
}


function EmptyStateBox({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
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
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export function RepoListWidget({
  results,
  isSearching,
  isError,
  hasQuery,
  trackedFullNames,
  onToggleTrack,
  refreshSignal,
}: RepoListWidgetProps) {

  if (!hasQuery) {
    return (
      <EmptyStateBox
        icon={<TravelExploreIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
        title="Search GitHub repositories"
        subtitle="Type a name, topic, or owner to explore millions of open-source projects"
      />
    );
  }

  if (isError) {
    return <ErrorState message="Search failed — check your connection and try again." />;
  }

  const gridSx = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
    gap: 1.5,
  };

  if (isSearching) {
    return (
      <Box sx={gridSx}>
        {SKELETONS.map((i) => <RepoCardSkeleton key={i} />)}
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyStateBox
        icon={<SearchOffIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
        title="No repositories found"
        subtitle="Try a different keyword or check the spelling"
      />
    );
  }

  return (
    <Box sx={gridSx}>
      {results.map((repo) => (
        <RepoItem
          key={repo.id}
          repo={repo}
          isTracked={trackedFullNames.includes(repo.fullName)}
          onToggleTrack={onToggleTrack}
          refreshSignal={refreshSignal}
        />
      ))}
    </Box>
  );
}
