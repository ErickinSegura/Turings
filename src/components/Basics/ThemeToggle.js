// src/components/ThemeToggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import {useTheme} from "../../context/themeContext";


const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-800 hover:text-gray-50 dark:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-800 transition-colors duration-200"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-6 h-6" />
            ) : (
                <Sun className="w-6 h-6" />
            )}
        </button>
    );
};

export default ThemeToggle;