import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition duration-500 ease-in-out hover:shadow-2xl backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center animate-fadeInScale">

        {/* Left - Logo */}
        <Link href="/">
          <span className="text-xl font-extrabold text-blue-700 dark:text-white cursor-pointer hover:text-blue-800 transition-transform duration-300 transform hover:scale-105">
            StackIt ✨
          </span>
        </Link>

        {/* Middle - Nav Links */}
        <div className="space-x-6 text-sm font-semibold hidden sm:flex">
          <Link href="/">
            <span className="hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer transition duration-300 transform hover:scale-105 hover:underline">
              Home
            </span>
          </Link>
          <Link href="/browse">
            <span className="hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer transition duration-300 transform hover:scale-105 hover:underline">
              Browse
            </span>
          </Link>
          <Link href="/ask">
            <span className="hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer transition duration-300 transform hover:scale-105 hover:underline">
              Ask
            </span>
          </Link>
        </div>

        {/* Right - Ask Button + Avatar + Dark Mode */}
        <div className="flex items-center gap-4">
          <Link href="/ask">
            <button className="bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 dark:from-sky-700 dark:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl">
              + Ask
            </button>
          </Link>
          <div
            className="w-9 h-9 rounded-full bg-cover bg-center border-2 border-blue-600 dark:border-sky-400 shadow-md hover:scale-105 transition-transform hover:ring-2 hover:ring-blue-400"
            style={{
              backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')",
            }}
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:scale-105 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
}

