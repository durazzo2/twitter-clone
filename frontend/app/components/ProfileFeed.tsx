"use client";

import {useState, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {formatDistanceToNowStrict} from 'date-fns';
import Link from "next/link";
import LikeButton from "./likeButton";
import FollowButton from "./FollowButton";
import RetweetButton from "./RetweetButton";
import CommentSection from "./CommentSection";
import ImageLightbox from "./ImageLightbox";

interface ProfileFeedProps {
    initialPosts: any[];
    currentUserId: number | null;
    profileUserId: number;
    profileUsername: string;
}

export default function ProfileFeed({initialPosts, currentUserId, profileUserId, profileUsername}: ProfileFeedProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);

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
        if (inView && hasMore && !isLoading) {
            loadMore();
        }
    }, [inView]);

    const loadMore = async () => {
        setIsLoading(true);
        const nextPage = page + 1;
        try {
            const res = await fetch(`/api/feed/user/${profileUserId}?page=${nextPage}`);
            const result = await res.json();
            const fetchedPosts = result.data || [];

            if (fetchedPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...fetchedPosts]);
                setPage(nextPage);
            }
        } catch (e) {
            console.error("Profile load more failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800 w-full overflow-hidden">
            {posts.map((post: any) => (
                <article key={post.id}
                         className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors w-full overflow-hidden">
                    {/* Retweet Label */}
                    {post.isProfileUserRetweet && (
                        <div className="flex items-center gap-2 text-gray-500 text-[13px] font-bold ml-12 mb-2">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                <path d="M4.5 3.88l4.432 4.43-1.77 1.77L4.5 7.42V17.5h15V15h2v4.5h-19V3.88z"></path>
                            </svg>
                            <span>{profileUsername} Retweeted</span>
                        </div>
                    )}

                    <div className="flex gap-4 min-w-0">
                        <Link href={`/${post.author?.username}`} className="flex-shrink-0">
                            <div
                                className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white hover:opacity-90 transition-opacity">
                                {post.author?.username?.charAt(0).toUpperCase()}
                            </div>
                        </Link>

                        {/* min-w-0 added here to prevent content from expanding parent */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 min-w-0">
                                    <Link href={`/${post.author?.username}`}
                                          className="font-bold hover:underline truncate">
                                        {post.author?.username}
                                    </Link>
                                    <span
                                        className="text-gray-500 text-sm truncate">@{post.author?.username?.toLowerCase()}</span>
                                    <span
                                        className="text-gray-500 text-sm flex-shrink-0">· {formatTime(post.createdAt)}</span>
                                </div>
                                {currentUserId && post.author.id !== currentUserId && (
                                    <div className="flex-shrink-0">
                                        <FollowButton userId={post.author.id} initialIsFollowing={post.isFollowing}/>
                                    </div>
                                )}
                            </div>

                            {/* THE FIX: break-words and whitespace-pre-wrap */}
                            <p className="mt-1 text-[15px] whitespace-pre-wrap break-words overflow-hidden leading-normal">
                                {post.content}
                            </p>

                            {post.imageUrl && post.imageUrl !== "null" && (
                                <div
                                    className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 cursor-zoom-in"
                                    onClick={() => setActiveImage(`http://localhost:3000${post.imageUrl}`)}>
                                    <img src={`http://localhost:3000${post.imageUrl}`} alt="Post"
                                         className="w-full h-auto max-h-96 object-cover"/>
                                </div>
                            )}

                            <div className="flex justify-between mt-3 text-gray-500 max-w-xs text-sm">
                                <CommentSection postId={post.id} initialComments={post.Comment || []}
                                                username={post.author?.username}/>
                                <RetweetButton postId={post.id} initialCount={post._count?.retweets || 0}
                                               initialIsRetweeted={post.isRetweeted}/>
                                <LikeButton postId={post.id} initialLikes={post._count?.likes || 0}
                                            initialIsLiked={post.isLiked}/>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
            {hasMore && <div ref={ref} className="p-8 text-center text-gray-500">{isLoading ? "Loading..." : ""}</div>}
            <ImageLightbox src={activeImage || ""} isOpen={!!activeImage} onClose={() => setActiveImage(null)}/>
        </div>
    );
}