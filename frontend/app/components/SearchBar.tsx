"use client";

import {useState, useEffect} from "react";
import {Search, Loader2} from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:3000/users/search?query=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error(`Server responded with ${res.status}`);

                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Search failed:", error);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="relative group w-full">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Users"
                    className="w-full bg-gray-100 dark:bg-gray-900 rounded-full py-2.5 px-12 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:bg-white dark:focus:bg-black transition-all"
                />
                <Search className="absolute left-4 top-3 text-gray-500" size={18}/>
                {isSearching && <Loader2 className="absolute right-4 top-3 animate-spin text-blue-500" size={18}/>}
            </div>

            {results.length > 0 && (
                <div
                    className="absolute top-12 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                    {results.map((user: any) => (
                        <Link
                            key={user.id}
                            href={`/${user.username}`}
                            onClick={() => setQuery("")}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                            <div
                                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm truncate">@{user.username}</span>
                                <span className="text-gray-500 text-xs">View profile</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}