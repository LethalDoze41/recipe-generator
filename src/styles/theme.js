import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#566246',      // Dark Green
      light: '#7A886B',
      dark: '#38422E',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#A4C2A5',      // Light Green
      light: '#C9E0CA',
      dark: '#7A967B',
      contrastText: '#2E332A',
    },
    background: {
      default: '#F1F2EB',   // Off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4A4A48',   // Dark Grey
      secondary: '#6B6B69',
    },
    success: {
      main: '#A4C2A5',
    },
    warning: {
      main: '#D8DAD3',
    },
    error: {
      main: '#BA1A1A',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#4A4A48',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#4A4A48',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#4A4A48',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(86, 98, 70, 0.2)',
          },
        },
        contained: {
          color: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(86, 98, 70, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;