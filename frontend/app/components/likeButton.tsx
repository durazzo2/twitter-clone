"use client";
import { useState } from "react";

export default function LikeButton({ postId, initialLikes, initialIsLiked }: any) {
    const [liked, setLiked] = useState(initialIsLiked);
    const [count, setCount] = useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            // 1. Get token from our internal bridge
            const authRes = await fetch('/api/auth/token');
            const { token } = await authRes.json();

            const method = liked ? 'DELETE' : 'POST';
            const res = await fetch(`http://localhost:3000/posts/${postId}/likes`, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setLiked(!liked);
                setCount((prev: number) => liked ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error("Like failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleLike} className={`flex items-center gap-2 ${liked ? "text-pink-600" : "text-gray-500"}`}>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 ${liked ? "fill-current" : "fill-none stroke-current"}`} strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{count}</span>
        </button>
    );
}