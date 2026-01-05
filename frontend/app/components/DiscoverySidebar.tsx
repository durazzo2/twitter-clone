import {getSuggestedUsers} from "@/app/lib/api";
import FollowButton from "./FollowButton";

export default async function DiscoverySidebar() {
    let suggestions = [];

    try {
        const response = await getSuggestedUsers();
        console.log("CLIENT SIDE DATA:", response);
        suggestions = Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        suggestions = [];
    }
    if (suggestions.length === 0) return null;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mt-4">
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            <div className="space-y-4">
                {suggestions.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.username?.[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{user.username}</p>
                                <p className="text-gray-500 text-xs">@{user.username?.toLowerCase()}</p>
                            </div>
                        </div>
                        <FollowButton userId={user.id} initialIsFollowing={false}/>
                    </div>
                ))}
            </div>
        </div>
    );
}