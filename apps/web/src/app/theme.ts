import { createTheme, type PaletteMode } from '@mui/material/styles';

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#00CCCC', light: '#33D9D9', dark: '#009999' },
      secondary: { main: '#0099B3' },
      background: {
        default: isDark ? '#0F172A' : '#F1F5F9',
        paper: isDark ? '#1E293B' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#1E293B',
        secondary: isDark ? '#94A3B8' : '#64748B',
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 700, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? 'rgba(0,204,204,0.15)' : 'rgba(0,204,204,0.12)'}`,
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 16px rgba(0,204,204,0.25)'
                : '0 4px 16px rgba(0,204,204,0.18)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
          containedPrimary: {
            background: '#00CCCC',
            boxShadow: '0 2px 8px rgba(0,204,204,0.3)',
            '&:hover': {
              background: '#00B3B3',
              boxShadow: '0 4px 12px rgba(0,204,204,0.4)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00CCCC',
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, minWidth: 120 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });
}
