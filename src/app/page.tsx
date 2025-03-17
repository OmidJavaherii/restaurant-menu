"use client";

import { useThemeStore } from "@/store/themeStore";
import {
  Brightness4,
  Brightness7,
  Restaurant,
  Info,
  AdminPanelSettings,
  RestaurantMenu,
} from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDarkMode ? 'dark bg-gray-800' : 'bg-gray-50'}`}>
      <div className="mb-6">
        <RestaurantMenu className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold mb-12 text-center text-light-text dark:text-dark-text">
        Restaurant Menu
      </h1>

      <div className="flex flex-col gap-4 max-w-[350px] w-full">
        <Link href="/menu" className="no-underline">
          <button className="btn btn-primary rounded">
            <Restaurant />
            <span>Menu</span>
          </button>
        </Link>

        <Link href="/about" className="no-underline">
          <button className="btn btn-primary rounded">
            <Info />
            <span>About</span>
          </button>
        </Link>

        <Link href="/login" className="no-underline">
          <button className="btn btn-secondary rounded">
            <AdminPanelSettings />
            <span>Admin</span>
          </button>
        </Link>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
        </button>
      </div>
    </div>
  );
}
