import { createTheme } from '@mui/material/styles';

export function buildMuiTheme(mode) {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: '#F2A93B', dark: '#c9861f', contrastText: '#14191d' },
      secondary: { main: '#3E7CB1' },
      error: { main: '#d1483f' },
      success: { main: '#4c9a6a' },
      background: {
        default: isDark ? '#14191d' : '#f4f3ee',
        paper: isDark ? '#1e252b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e7e9e6' : '#14191d',
        secondary: isDark ? '#8a969c' : '#5a6870',
      },
      divider: isDark ? '#2a333a' : '#e7e9e6',
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 14 },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  });
}
