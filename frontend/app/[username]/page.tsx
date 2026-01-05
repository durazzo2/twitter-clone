import { getUserProfile, getUserPosts } from "@/app/lib/api";
import ProfileFeed from "@/app/components/ProfileFeed";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { username: string } }) {
    const { username } = await params;

    let user;
    try {
        user = await getUserProfile(username);
    } catch (e) {
        return notFound();
    }

    const initialPosts = await getUserPosts(user.id, 1);

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    let currentUserId: number | null = null;

    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            currentUserId = decoded.sub || decoded.id;
        } catch (e) {}
    }

    return (
        <main className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-black">
            <div className="h-48 bg-gray-200 dark:bg-gray-800" />

            <div className="px-4 pb-4 border-b border-gray-100 dark:border-gray-900">
                <div className="relative flex justify-between items-end -mt-16">
                    <div className="w-32 h-32 bg-blue-500 rounded-full border-4 border-white dark:border-black flex items-center justify-center text-4xl font-bold text-white uppercase">
                        {user.username.charAt(0)}
                    </div>

                    {currentUserId === user.id ? (
                        <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 font-bold hover:bg-gray-50 transition-colors">
                            Edit Profile
                        </button>
                    ) : (
                        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold">
                            Follow
                        </button>
                    )}
                </div>

                <div className="mt-4">
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p className="text-gray-500">@{user.username.toLowerCase()}</p>

                    <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <span><b className="text-black dark:text-white">{user._count?.following || 0}</b> Following</span>
                        <span><b className="text-black dark:text-white">{user._count?.followers || 0}</b> Followers</span>
                    </div>
                </div>
            </div>

            <ProfileFeed
                initialPosts={initialPosts}
                currentUserId={currentUserId}
                profileUserId={user.id}
                profileUsername={user.username}
            />
        </main>
    );
}