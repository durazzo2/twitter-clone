"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/lib/actions";

export default function FollowButton({
                                         userId,
                                         initialIsFollowing
                                     }: {
    userId: number;
    initialIsFollowing: boolean
}) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    const handleAction = async () => {
        // Optimistic toggle
        const nextState = !isFollowing;
        setIsFollowing(nextState);

        startTransition(async () => {
            try {
                const result = await toggleFollow(userId, isFollowing);
                if (result?.error) {
                    setIsFollowing(!nextState); // Rollback
                }
            } catch (e) {
                setIsFollowing(!nextState); // Rollback
            }
        });
    };

    return (
        <button
            onClick={handleAction}
            disabled={isPending}
            className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                isFollowing
                    ? "border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-black dark:text-white"
                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
            }`}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
}