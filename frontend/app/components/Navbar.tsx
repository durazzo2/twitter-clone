"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, [pathname]);

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-gray-800">
            <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
                <div className="flex gap-6">
                    <Link href="/feed" className={`flex items-center gap-2 font-bold ${pathname === "/feed" ? "text-blue-500" : "text-gray-500"}`}>
                        <Home size={20} />
                        <span>Feed</span>
                    </Link>

                    {username && (
                        <Link href={`/${username}`} className={`flex items-center gap-2 font-bold ${pathname === `/${username}` ? "text-blue-500" : "text-gray-500"}`}>
                            <User size={20} />
                            <span>Profile</span>
                        </Link>
                    )}
                </div>

                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold transition-colors">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}