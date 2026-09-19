import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TrackedRepoListWidget } from '../widgets/TrackedRepoListWidget';

export function TrackedReposPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Tracked Repositories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor stats and activity for your favourite repos
        </Typography>
      </Box>
      <TrackedRepoListWidget />
    </Stack>
  );
}
