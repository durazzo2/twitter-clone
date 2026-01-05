"use client";

import {useState, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {formatDistanceToNowStrict} from 'date-fns';
import {MoreHorizontal, Trash2, Edit3, Loader2} from "lucide-react";
import Link from "next/link";
import LikeButton from "./likeButton";
import FollowButton from "./FollowButton";
import RetweetButton from "./RetweetButton";
import CommentSection from "./CommentSection";
import ImageLightbox from "./ImageLightbox";

export default function InfiniteFeed({initialPosts, currentUserId}: any) {
    const [posts, setPosts] = useState(initialPosts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const {ref, inView} = useInView({rootMargin: '200px'});

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNowStrict(new Date(dateString))
                .replace(' seconds', 's').replace(' minute', 'm')
                .replace(' minutes', 'm').replace(' hour', 'h')
                .replace(' hours', 'h').replace(' day', 'd');
        } catch {
            return "now";
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMorePosts();
        }
    }, [inView, hasMore, isLoading]);

    const loadMorePosts = async () => {
        setIsLoading(true);
        const nextPage = page + 1;
        try {
            const res = await fetch(`/api/feed?page=${nextPage}`);
            const result = await res.json();
            const fetchedPosts = result.data || [];

            if (fetchedPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev: any) => [...prev, ...fetchedPosts]);
                setPage(nextPage);
            }
        } catch (e) {
            console.error("Error loading more posts", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (postId: number) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) setPosts((prev: any) => prev.filter((p: any) => p.id !== postId));
        } catch (error) { console.error("Delete failed", error); }
        setOpenMenuId(null);
    };

    const handleEditStart = (post: any) => {
        setEditingPostId(post.id);
        setEditContent(post.content);
        setOpenMenuId(null);
    };

    const handleUpdate = async (postId: number) => {
        try {
            const res = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({content: editContent})
            });
            if (res.ok) {
                setPosts((prev: any) => prev.map((p: any) => p.id === postId ? { ...p, content: editContent, updatedAt: new Date().toISOString() } : p));
                setEditingPostId(null);
            }
        } catch (error) { console.error("Update failed", error); }
    };

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800 w-full">
            {posts.map((post: any) => {
                const isEdited = new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() + 1000;

                return (
                    <article key={post.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors w-full relative">
                        {post.isRetweetedByCurrentUser && (
                            <div className="flex items-center gap-2 text-gray-500 text-[13px] font-bold ml-14 mb-2">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M4.5 3.88l4.432 4.43-1.77 1.77L4.5 7.42V17.5h15V15h2v4.5h-19V3.88z"></path></svg>
                                <span>You Retweeted</span>
                            </div>
                        )}

                        <div className="flex gap-4 min-w-0">
                            <Link href={`/${post.author?.username}`} className="flex-shrink-0">
                                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                    {post.author?.avatarUrl ? (
                                        <img src={`http://localhost:3000${post.author.avatarUrl}`} className="w-full h-full object-cover" />
                                    ) : (
                                        post.author?.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </Link>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                                        <Link href={`/${post.author?.username}`} className="font-bold text-[17px] hover:underline truncate">{post.author?.username}</Link>
                                        <span className="text-gray-500 text-[15px] truncate">@{post.author?.username?.toLowerCase()}</span>
                                        <span className="text-gray-500 text-[15px] flex-shrink-0">· {formatTime(post.createdAt)}</span>
                                        {isEdited && <span className="text-gray-400 text-[13px] flex-shrink-0 cursor-help" title={`Edited at ${new Date(post.updatedAt).toLocaleString()}`}>· Edited</span>}
                                    </div>

                                    <div className="flex items-center gap-2 relative">
                                        {currentUserId === post.author.id && (
                                            <div className="relative">
                                                <button onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"><MoreHorizontal size={18} className="text-gray-500"/></button>
                                                {openMenuId === post.id && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                                        <button onClick={() => handleEditStart(post)} className="w-full flex items-center gap-2 p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"><Edit3 size={14}/> Edit</button>
                                                        <button onClick={() => handleDelete(post.id)} className="w-full flex items-center gap-2 p-3 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-t border-gray-100 dark:border-gray-800"><Trash2 size={14}/> Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {currentUserId && post.author.id !== currentUserId && <FollowButton userId={post.author.id} initialIsFollowing={post.isFollowing}/>}
                                    </div>
                                </div>

                                {editingPostId === post.id ? (
                                    <div className="mt-2">
                                        <textarea className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl p-3 outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] text-[17px] resize-none" value={editContent} onChange={(e) => setEditContent(e.target.value)} autoFocus />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={() => setEditingPostId(null)} className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                            <button onClick={() => handleUpdate(post.id)} className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors">Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-[17px] leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
                                )}

                                {post.imageUrl && post.imageUrl !== "null" && (
                                    <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 cursor-zoom-in active:scale-[0.99] transition-transform" onClick={() => setActiveImage(`http://localhost:3000${post.imageUrl}`)}>
                                        <img src={`http://localhost:3000${post.imageUrl}`} alt="Post media" className="w-full h-auto max-h-[500px] object-cover"/>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <div className="flex justify-between text-gray-500 max-w-sm text-sm items-center">
                                        <CommentSection postId={post.id} initialComments={post.Comment || []} username={post.author?.username}/>
                                        <RetweetButton postId={post.id} initialCount={post._count?.retweets || 0} initialIsRetweeted={post.isRetweeted}/>
                                        <LikeButton postId={post.id} initialLikes={post._count?.likes || 0} initialIsLiked={post.isLiked}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                );
            })}
            {hasMore && <div ref={ref} className="p-8 flex justify-center text-gray-500">{isLoading ? <Loader2 className="animate-spin text-blue-500" size={24}/> : ""}</div>}
            <ImageLightbox src={activeImage || ""} isOpen={!!activeImage} onClose={() => setActiveImage(null)}/>
        </div>
    );
}