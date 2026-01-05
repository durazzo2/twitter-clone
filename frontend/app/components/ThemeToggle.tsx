"use client";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Sun, Moon} from "lucide-react"


export default function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="p-5"/>;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
            title="Toggle Theme"
        >
            {theme === "dark" ? (
                <Sun
                    className="text-amber-400 hover:text-amber-300 transition-all duration-300"
                    size={20}
                    fill="currentColor"
                />
            ) : (
                <Moon
                    className="text-slate-700 hover:text-blue-600 transition-all duration-300"
                    size={20}
                    fill="currentColor"
                />
            )}
        </button>
    );
}