'use client';

import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';
import '@/styles/globals.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const isDarkMode = useThemeStore((state: { isDarkMode: boolean }) => state.isDarkMode);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#90caf9' : '#2196f3', // Lighter blue in dark mode
      },
      secondary: {
        main: isDarkMode ? '#f48fb1' : '#f50057', // Lighter pink in dark mode
      },
      background: {
        default: isDarkMode ? '#121212' : '#ffffff',
        paper: isDarkMode ? '#1e1e1e' : '#f0f2f5',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#1a1a1a',
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            color: isDarkMode ? '#ffffff' : '#1a1a1a',
            '&.MuiButton-contained': {
              backgroundColor: isDarkMode ? '#90caf9' : '#2196f3',
              '&:hover': {
                backgroundColor: isDarkMode ? '#42a5f5' : '#1976d2'
              }
            }
          },
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div className="app-container">
          {children}
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 