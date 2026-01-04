"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="p-5" />; // Placeholder to avoid layout shift

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
            title="Toggle Theme"
        >
            {theme === "dark" ? (
                <span className="text-xl">☀️</span>
            ) : (
                <span className="text-xl">🌙</span>
            )}
        </button>
    );
}