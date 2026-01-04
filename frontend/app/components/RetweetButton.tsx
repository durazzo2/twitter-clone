"use client";

import { useState, useTransition } from "react";
import { toggleRetweet } from "@/app/lib/actions";

export default function RetweetButton({
                                          postId,
                                          initialCount,
                                          initialIsRetweeted
                                      }: {
    postId: number;
    initialCount: number;
    initialIsRetweeted: boolean
}) {
    const [isRetweeted, setIsRetweeted] = useState(initialIsRetweeted);
    const [count, setCount] = useState(initialCount);
    const [isPending, startTransition] = useTransition();

    const handleRetweet = async () => {
        // Optimistic Update
        const nextState = !isRetweeted;
        setIsRetweeted(nextState);
        setCount(prev => nextState ? prev + 1 : prev - 1);

        startTransition(async () => {
            const result = await toggleRetweet(postId, isRetweeted);
            if (result?.error) {
                // Rollback on error
                setIsRetweeted(!nextState);
                setCount(prev => !nextState ? prev + 1 : prev - 1);
            }
        });
    };

    return (
        <button
            onClick={handleRetweet}
            disabled={isPending}
            className={`flex items-center gap-1 transition-colors hover:text-green-500 ${
                isRetweeted ? "text-green-500" : "text-gray-500"
            }`}
        >
            <span className={`p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20`}>
                🔄
            </span>
            <span className="text-xs">{count}</span>
        </button>
    );
}