"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, UserPlus, Repeat, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadNotifications = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:3000/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setNotifications(data);

                await fetch("http://localhost:3000/notifications/mark-as-read", {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Failed to load notifications", error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    if (loading) return <div className="p-20 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto min-h-screen border-x border-gray-200 dark:border-gray-800 bg-white dark:bg-black pt-14">


            <div className="sticky top-14 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="hover:bg-gray-100 dark:hover:bg-zinc-900 p-2 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">Notifications</h1>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-900">
                {notifications.map((notif: any) => (
                    <Link
                        key={notif.id}
                        href={`/${notif.issuer.username}`}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-950 flex gap-4 transition-colors block group overflow-hidden"
                    >
                        <div className="mt-1 flex-shrink-0">
                            {notif.type === 'LIKE' && <Heart className="text-red-500 fill-red-500" size={22} />}
                            {notif.type === 'FOLLOW' && <UserPlus className="text-blue-500" size={22} />}
                            {notif.type === 'COMMENT' && <MessageCircle className="text-green-500" size={22} />}
                            {notif.type === 'RETWEET' && <Repeat className="text-pink-500" size={22} />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <img
                                    src={notif.issuer.avatarUrl || `https://ui-avatars.com/api/?name=${notif.issuer.username}`}
                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                                    alt="Avatar"
                                />
                                <span className="font-bold text-sm group-hover:underline truncate">
                                    @{notif.issuer.username}
                                </span>
                            </div>

                            <p className="text-gray-800 dark:text-gray-200 text-sm">
                                {notif.type === 'LIKE' && "liked your post"}
                                {notif.type === 'FOLLOW' && "started following you"}
                                {notif.type === 'COMMENT' && "commented on your post"}
                                {notif.type === 'RETWEET' && "retweeted your post"}
                            </p>

                            {notif.post && (
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                    <p className="text-gray-500 text-xs italic break-all line-clamp-2">
                                        "{notif.post.content}"
                                    </p>
                                </div>
                            )}

                            <span className="text-[10px] text-gray-400 mt-2 block">
                                {new Date(notif.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}