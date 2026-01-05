"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

export default function DiscoverSidebar() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/users/suggestions", {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (res.ok) setUsers(await res.json());
        };
        fetchSuggestions();
    }, []);

    if (users.length === 0) return null;

    return (
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl overflow-hidden mt-4">
            <h2 className="text-xl font-black p-4">Who to follow</h2>
            {users.map((user: any) => (
                <div key={user.id}
                     className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                    <Link href={`/${user.username}`} className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-blue-500 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold">
                            {user.avatarUrl ? (
                                <img src={`http://localhost:3000${user.avatarUrl}`}
                                     className="w-full h-full object-cover"/>
                            ) : (
                                user.username[0].toUpperCase()
                            )}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="font-bold text-sm truncate">{user.username}</span>
                            <span className="text-gray-500 text-xs truncate">@{user.username.toLowerCase()}</span>
                        </div>
                    </Link>
                    <FollowButton userId={user.id} initialIsFollowing={false}/>
                </div>
            ))}
        </div>
    );
}