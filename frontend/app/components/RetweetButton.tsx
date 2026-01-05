"use client";

import {useState, useTransition} from "react";
import {toggleRetweet} from "@/app/lib/actions";
import {Repeat2} from "lucide-react"

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
        const nextState = !isRetweeted;
        setIsRetweeted(nextState);
        setCount(prev => nextState ? prev + 1 : prev - 1);

        startTransition(async () => {
            const result = await toggleRetweet(postId, isRetweeted);
            if (result?.error) {
                setIsRetweeted(!nextState);
                setCount(prev => !nextState ? prev + 1 : prev - 1);
            }
        });
    };

    return (
        <button
            onClick={handleRetweet}
            disabled={isPending}
            className={`flex items-center gap-1 transition-colors  ${
                isRetweeted
                    ? "text-blue-500"
                    : "text-gray-500/60 hover:text-blue-300"}`}
        >
            <Repeat2/>
            <span className="text-xs">{count}</span>
        </button>
    );
}