'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeStore } from '@/store/themeStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';

const queryClient = new QueryClient();

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#4B5563',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#9CA3AF',
      light: '#D1D5DB',
      dark: '#6B7280',
    },
    background: {
      default: '#111827',
      paper: '#1A2E49',
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeStore();

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
} 