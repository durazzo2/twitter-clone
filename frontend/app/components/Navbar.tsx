"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Home, User, LogOut, Bell} from "lucide-react";
import {useEffect, useState} from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const fetchUnreadCount = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch('http://localhost:3000/notifications/unread-count', {
                headers: {'Authorization': `Bearer ${token}`}
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error("Failed to fetch notification count", error);
        }
    };

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        fetchUnreadCount();

        const interval = setInterval(fetchUnreadCount, 120000);
        return () => clearInterval(interval);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    return (
        <nav
            className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-gray-800">
            <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
                <div className="flex gap-6">
                    <Link href="/feed"
                          className={`flex items-center gap-2 font-bold ${pathname === "/feed" ? "text-blue-500" : "text-gray-500"}`}>
                        <Home size={20}/>
                        <span>Feed</span>
                    </Link>

                    <Link href="/notifications"
                          className={`relative flex items-center gap-2 font-bold ${pathname === "/notifications" ? "text-blue-500" : "text-gray-500"}`}>
                        <Bell size={20}/>
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <span
                                className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Link>

                    {username && (
                        <Link href={`/${username}`}
                              className={`flex items-center gap-2 font-bold ${pathname === `/${username}` ? "text-blue-500" : "text-gray-500"}`}>
                            <User size={20}/>
                            <span>Profile</span>
                        </Link>
                    )}
                </div>

                <button onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold transition-colors">
                    <LogOut size={18}/>
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}