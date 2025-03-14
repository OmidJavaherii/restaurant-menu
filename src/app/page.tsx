'use client';

import { Button, Container, IconButton } from '@mui/material';
import { useThemeStore } from '@/store/themeStore';
import { Brightness4, Brightness7, Restaurant, Info, AdminPanelSettings } from '@mui/icons-material';
import Link from 'next/link';
import '../styles/globals.css';

export default function Home() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Restaurant Menu
      </h1>
      
      <div
        className="grid grid-cols-2 gap-4 max-w-[400px] w-full"
      >
        <Link href="/menu" className='no-underline'>
          <Button
          variant="contained"
          size="large"
          startIcon={<Restaurant />}
            className="w-full h-16"
          >
            Menu
          </Button>
        </Link>

        <Link href="/about" className="no-underline">
          <Button
            variant="contained"
            size="large"
            startIcon={<Info />}
            className="w-full h-16"
          >
            About
          </Button>
        </Link>

        <Link href="/admin" className="no-underline">
          <Button
            variant="contained"
            size="large"
            startIcon={<AdminPanelSettings />}
            className="w-full h-16"
          >
            Admin
          </Button>
        </Link>

        <IconButton
          onClick={toggleTheme}
          color="inherit"
          className="w-full h-16 border-2 border-current rounded"
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          <span className="ml-2">
            {isDarkMode ? 'Light' : 'Dark'} Mode
          </span>
        </IconButton>
      </div>
    </Container>
  );
} 