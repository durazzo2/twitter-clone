import { getUserProfile, getUserPosts } from "@/app/lib/api";
import ProfileFeed from "@/app/components/ProfileFeed";
import ProfileHeader from "@/app/components/ProfileHeader"; // We will create this
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
            currentUserId = Number(decoded.sub || decoded.id);
        } catch (e) {}
    }

    return (
        <main className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-black">
            <div className="h-48 bg-gray-200 dark:bg-gray-800" />

            <ProfileHeader
                user={user}
                currentUserId={currentUserId}
            />

            <ProfileFeed
                initialPosts={initialPosts}
                currentUserId={currentUserId}
                profileUserId={user.id}
                profileUsername={user.username}
            />
        </main>
    );
}