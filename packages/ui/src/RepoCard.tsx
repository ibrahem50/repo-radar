import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import CommitIcon from '@mui/icons-material/Commit';
import CodeIcon from '@mui/icons-material/Code';
import type { RepoSummary, CommitInfo } from '@repo-radar/github-api';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';

export interface RepoCardProps {
  repo: RepoSummary;
  isTracked: boolean;
  onToggleTrack: (repo: RepoSummary) => void;
  latestCommit?: CommitInfo | null;
  isRefreshing?: boolean;
  isRefreshError?: boolean;
  refreshErrorMessage?: string;
  onRefresh?: () => void;
}

export function RepoCard({
  repo,
  isTracked,
  onToggleTrack,
  latestCommit,
  isRefreshing,
  isRefreshError,
  refreshErrorMessage,
  onRefresh,
}: RepoCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >

      <CardContent sx={{ flex: 1, pb: 1, pt: 2, px: 2 }}>
        {/* Header */}
        <Stack direction="row" alignItems="flex-start" spacing={1.25}>
          <Avatar
            src={repo.avatarUrl}
            alt={repo.owner}
            sx={{ width: 40, height: 40, flexShrink: 0, mt: 0.25 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontWeight: 500, display: 'block', lineHeight: 1.2 }}
                >
                  {repo.owner}
                </Typography>
                <Typography
                  variant="subtitle2"
                  noWrap
                  sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.3 }}
                >
                  {repo.name}
                </Typography>
              </Box>
              {onRefresh && (
                <Tooltip title="Refresh commit">
                  <IconButton
                    size="small"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    sx={{ flexShrink: 0, ml: 0.5, color: 'text.disabled' }}
                  >
                    <RefreshIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.25,
            mb: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            minHeight: '3em',
            fontSize: '0.8rem',
          }}
        >
          {repo.description
            ? repo.description.length > 133
              ? `${repo.description.slice(0, 133)}…`
              : repo.description
            : <span style={{ color: 'transparent' }}>—</span>}
        </Typography>

        {/* Stats row */}
        <Stack direction="row" flexWrap="wrap" sx={{ mt: 1.5, gap: 0.75 }}>
          <Chip
            icon={<StarRoundedIcon sx={{ fontSize: '13px !important', color: '#F59E0B !important' }} />}
            label={repo.stargazersCount.toLocaleString()}
            size="small"
            variant="outlined"
            sx={{ borderColor: '#FDE68A', bgcolor: '#FFFBEB', color: '#92400E', fontWeight: 600 }}
          />
          <Chip
            icon={<BugReportOutlinedIcon sx={{ fontSize: '13px !important' }} />}
            label={`${repo.openIssuesCount.toLocaleString()} issues`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          {repo.language && (
            <Chip
              icon={<CodeIcon sx={{ fontSize: '13px !important', color: '#00CCCC !important' }} />}
              label={repo.language}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Stack>

        {/* Commit chip — pushed_at from the repo payload; commit date only as a fallback when it is missing */}
        {isRefreshing && (
          <Box sx={{ mt: 1 }}>
            <LoadingSkeleton />
          </Box>
        )}
        {!isRefreshing && (repo.pushedAt ?? latestCommit?.authoredAt) && (
          <Chip
            icon={<CommitIcon sx={{ fontSize: '13px !important', color: 'text.disabled !important' }} />}
            label={`Last commit ${new Date((repo.pushedAt ?? latestCommit?.authoredAt)!).toLocaleDateString()}`}
            size="small"
            variant="outlined"
            sx={{ mt: 1, fontSize: '0.7rem', height: 22, color: 'text.secondary', borderColor: 'divider' }}
          />
        )}
        {!isRefreshing && isRefreshError && (
          <Box sx={{ mt: 1.25 }}>
            <ErrorState
              message={refreshErrorMessage ?? "Couldn't load commit date."}
              onRetry={onRefresh}
            />
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={isTracked ? <BookmarkRemoveIcon sx={{ fontSize: '15px !important' }} /> : <BookmarkAddIcon sx={{ fontSize: '15px !important' }} />}
          color={isTracked ? 'error' : 'primary'}
          onClick={() => onToggleTrack(repo)}
          sx={{ fontSize: '0.75rem', py: 0.5 }}
        >
          {isTracked ? 'Untrack' : 'Track'}
        </Button>
        <Link href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" underline="none">
          <Button
            size="small"
            variant="text"
            endIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ fontSize: '0.75rem', color: 'text.secondary', py: 0.5 }}
          >
            GitHub
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
