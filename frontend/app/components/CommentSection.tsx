"use client";
import { useState } from "react";

export default function CommentSection({ postId, initialComments }: any) {
    const [comments, setComments] = useState(initialComments || []);
    const [text, setText] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const postComment = async () => {
        if (!text.trim()) return;

        try {
            const authRes = await fetch('/api/auth/token');
            const { token } = await authRes.json();

            const res = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: text })
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments((prev: any) => [...prev, newComment]);
                setText("");
            }
        } catch (e) {
            console.error("Comment failed", e);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-sm text-gray-500 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.7 8.38 8.38 0 013.8.9L21 3z" /></svg>
                {comments.length}
            </button>
            {isOpen && (
                <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 bg-transparent border-b border-gray-700 outline-none" placeholder="Reply..." />
                        <button onClick={postComment} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">Post</button>
                    </div>
                    {comments.map((c: any) => (
                        <div key={c.id} className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded">
                            <span className="font-bold">@{c.author?.username}</span>: {c.content}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}