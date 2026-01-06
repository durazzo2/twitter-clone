"use client";
import {useState} from "react";
import EditProfileModal from "./EditProfileModal";
import FollowButton from "@/app/components/FollowButton";

export default function ProfileHeader({user, currentUserId}: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isOwner = user.id === currentUserId;

    return (
        <div className="px-4 pb-4 border-b border-gray-100 dark:border-gray-900">
            <div className="relative flex justify-between items-end -mt-16">

                <div
                    className="w-32 h-32 bg-blue-500 rounded-full border-4 border-white dark:border-black flex items-center justify-center text-4xl font-bold text-white uppercase overflow-hidden">
                    {user.avatarUrl ? (
                        <img src={`http://localhost:3000${user.avatarUrl}`} className="w-full h-full object-cover"/>
                    ) : (
                        user.username.charAt(0)
                    )}
                </div>

                {isOwner ? (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <FollowButton
                        userId={user.id}
                        initialIsFollowing={user.isFollowing}
                    />
                )}
            </div>

            <div className="mt-4">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-gray-500">@{user.username.toLowerCase()}</p>

                {user.bio && (
                    <p className="mt-3 text-[15px] whitespace-pre-wrap leading-relaxed">
                        {user.bio}
                    </p>
                )}

                <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <span><b className="text-black dark:text-white">{user._count?.following || 0}</b> Following</span>
                    <span><b className="text-black dark:text-white">{user._count?.followers || 0}</b> Followers</span>
                </div>
            </div>

            <EditProfileModal
                user={user}
                currentUserId={currentUserId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}