import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getFeed(page: number = 1) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/feed?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store',
        });

        if (res.status === 401) redirect("/login");

        if (!res.ok) {
            console.error(`Feed fetch failed: ${res.status}`);
            return [];
        }

        const result = await res.json();
        return result.data || result;
    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
        console.error("Network error fetching feed:", error);
        return [];
    }
}

export async function getSuggestedUsers() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const res = await fetch(`${API_URL}/users/suggestions`, {
        headers: {Authorization: `Bearer ${token}`},
        next: {revalidate: 60}
    });
    return res.json();
}



export async function getUserProfile(username: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const res = await fetch(`${API_URL}/users/profile/${username}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

export async function getUserPosts(userId: number, page: number = 1) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const res = await fetch(`${API_URL}/feed/user/${userId}?page=${page}`, {
        headers: {Authorization: `Bearer ${token}`},
        cache: 'no-store'
    });
    const result = await res.json();
    return result.data || [];
}