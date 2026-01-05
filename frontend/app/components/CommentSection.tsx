"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CommentSection({ postId, initialComments }: any) {
    const [comments, setComments] = useState(initialComments || []);
    const [text, setText] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const postComment = async () => {
        if (!text.trim()) return;
        try {
            const token = localStorage.getItem("token");
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
        } catch (e) { console.error(e); }
    };

    return (
        <div className="contents">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
                <MessageCircle size={18} />
                <span className="text-sm">{comments.length}</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="bg-white dark:bg-black w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Comments</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {comments.map((c: any) => (
                                <div key={c.id} className="flex gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0 overflow-hidden">
                                        {c.author?.avatarUrl ? (
                                            <img src={`http://localhost:3000${c.author.avatarUrl}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-bold">{c.author?.username?.[0].toUpperCase()}</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">@{c.author?.username}</p>
                                        <p className="text-[15px] text-gray-800 dark:text-gray-200">{c.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="flex-1 bg-gray-100 dark:bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Post your reply"
                            />
                            <button onClick={postComment} className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">Reply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}