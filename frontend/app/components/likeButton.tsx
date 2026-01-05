"use client";
import {useState} from "react";
import {Heart} from "lucide-react"

export default function LikeButton({postId, initialLikes, initialIsLiked}: any) {
    const [liked, setLiked] = useState(initialIsLiked);
    const [count, setCount] = useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const authRes = await fetch('/api/auth/token');
            const {token} = await authRes.json();

            const method = liked ? 'DELETE' : 'POST';
            const res = await fetch(`http://localhost:3000/posts/${postId}/likes`, {
                method: method,
                headers: {'Authorization': `Bearer ${token}`}
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
            <Heart fill={liked ? "currentColor" : "none"} />
            <span>{count}</span>
        </button>
    );
}