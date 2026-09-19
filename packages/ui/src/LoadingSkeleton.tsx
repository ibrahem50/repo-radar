import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export function LoadingSkeleton() {
  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={96} height={24} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={140} height={24} sx={{ borderRadius: 2 }} />
      </Stack>
    </Stack>
  );
}
