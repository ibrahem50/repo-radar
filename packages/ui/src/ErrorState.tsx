import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 1.5,
        bgcolor: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
      }}
    >
      <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 16, flexShrink: 0 }} />
      <Typography
        variant="caption"
        color="error.main"
        sx={{ flex: 1, fontWeight: 500, lineHeight: 1.4 }}
      >
        {message}
      </Typography>
      {onRetry && (
        <Button
          size="small"
          startIcon={<RefreshIcon sx={{ fontSize: '13px !important' }} />}
          onClick={onRetry}
          color="error"
          variant="text"
          sx={{
            flexShrink: 0,
            fontSize: '0.7rem',
            py: 0.25,
            px: 0.75,
            minWidth: 0,
            lineHeight: 1.4,
          }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
