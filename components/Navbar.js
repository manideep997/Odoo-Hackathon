import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold gradient-text cursor-pointer hover:scale-105 transition-transform duration-300">
              StackIt ✨
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors duration-200">
                Home
              </span>
            </Link>
            <Link href="/browse">
              <span className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors duration-200">
                Browse
              </span>
            </Link>
            <Link href="/ask">
              <span className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors duration-200">
                Ask Question
              </span>
            </Link>
          </div>

          {/* Right Side - Auth & Controls */}
          <div className="flex items-center space-x-4">
            {/* Ask Button */}
            <Link href="/ask">
              <button className="btn-primary hidden sm:block">
                ✍️ Ask Question
              </button>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-colors duration-200"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* User Authentication */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 p-0.5 cursor-pointer hover:scale-105 transition-transform duration-200"
                  title={`${user.username}'s profile`}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.reputation || 0} reputation
                  </p>
                </div>

                {/* Logout Button */}
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <button className="btn-ghost">Login</button>
                </Link>
                <Link href="/auth/register">
                  <button className="btn-secondary">Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
