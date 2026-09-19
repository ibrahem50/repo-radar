import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export function RepoCardSkeleton() {
  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2 }}
    >
      <CardContent sx={{ flex: 1, pt: 2, px: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width={70} height={14} />
            <Skeleton variant="text" width={120} height={18} sx={{ mt: 0.25 }} />
          </Box>
          <Skeleton variant="circular" width={24} height={24} sx={{ flexShrink: 0 }} />
        </Stack>

        <Skeleton variant="text" width="95%" height={14} sx={{ mt: 1.5 }} />
        <Skeleton variant="text" width="75%" height={14} sx={{ mt: 0.5 }} />

        <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
          <Skeleton variant="text" width={50} height={14} />
          <Skeleton variant="text" width={70} height={14} />
          <Skeleton variant="text" width={60} height={14} />
        </Stack>
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
        <Skeleton variant="rounded" width={72} height={28} sx={{ borderRadius: 1.5 }} />
        <Skeleton variant="rounded" width={72} height={28} sx={{ borderRadius: 1.5 }} />
      </CardActions>
    </Card>
  );
}
