import { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SearchIcon from '@mui/icons-material/Search';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { selectTrackedRepoFullNames } from '@repo-radar/store';
import { useAppSelector } from './app/hooks';
import { createAppTheme } from './app/theme';
import { SearchPage } from './pages/SearchPage';
import { TrackedReposPage } from './pages/TrackedReposPage';

type ThemeMode = 'light' | 'dark';

function getInitialMode(): ThemeMode {
  try {
    return (localStorage.getItem('theme-mode') as ThemeMode) ?? 'light';
  } catch {
    return 'light';
  }
}

export function App() {
  const [tab, setTab] = useState<'search' | 'tracked'>('search');
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const trackedCount = useAppSelector(selectTrackedRepoFullNames).length;

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleMode = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    try { localStorage.setItem('theme-mode', next); } catch { /* ignore */ }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #009999 0%, #00CCCC 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <TrackChangesIcon sx={{ color: 'white', fontSize: 28 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', letterSpacing: '-0.02em' }}>
              Repo Radar
            </Typography>
            <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
              <IconButton onClick={toggleMode} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              px: 2,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.65)', minHeight: 48 },
              '& .Mui-selected': { color: '#FFFFFF !important' },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              value="search"
              label="Search"
              icon={<SearchIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              value="tracked"
              label="Tracked Repos"
              icon={
                <Badge
                  badgeContent={trackedCount}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16, p: '0 4px' } }}
                >
                  <BookmarksIcon fontSize="small" />
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 3, sm: 6, md: 10 } }}>
          <Box role="tabpanel" hidden={tab !== 'search'}>
            {tab === 'search' && <SearchPage />}
          </Box>
          <Box role="tabpanel" hidden={tab !== 'tracked'}>
            {tab === 'tracked' && <TrackedReposPage />}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
