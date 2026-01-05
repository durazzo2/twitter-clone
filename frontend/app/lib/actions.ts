"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


export async function register(prevState: any, formData: FormData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(`Attempting register at: ${API_URL}/users/register`);

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password}),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend Register Error:", errorText);

            try {
                const errorData = JSON.parse(errorText);
                return {error: errorData.message || "Registration failed"};
            } catch {
                return {error: `Server Error: ${response.status}`};
            }
        }
    } catch (error) {
        console.error("Network Error:", error);
        return {error: "Could not connect to the server."};
    }

    redirect("/login");
}


export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (!response.ok) {
            return {error: data.message || "Invalid credentials"};
        }

        const token = data.access_token;
        const username = data.user.username;

        const cookieStore = await cookies();
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            success: true,
            username: username,
            token: token
        };

    } catch (error) {
        return {error: "Could not connect to the server."};
    }
}


export async function createPost(prevState: any, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const cleanData = new FormData();

    const content = formData.get("content");
    const image = formData.get("image") as File;

    if (content) {
        cleanData.append("content", content as string);
    }

    if (image && image.size > 0) {
        cleanData.append("image", image);
    }

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: cleanData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {error: errorData.message || "Failed to create post"};
        }

        revalidatePath("/feed");
        return {success: true};
    } catch (err) {
        return {error: "Connection error"};
    }
}

export async function toggleLike(postId: number, isLiked: boolean) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const url = `${API_URL}/posts/${postId}/likes`;
    const method = isLiked ? "DELETE" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!response.ok) {
            const errorData = await response.json();

            if (response.status === 409 || response.status === 404) {
                revalidatePath("/feed");
                return;
            }

            console.error("Backend Like Error:", errorData);
            throw new Error("Failed to update like");
        }

        revalidatePath("/feed");
    } catch (error) {
        throw error;
    }
}

export async function toggleFollow(targetUserId: number, isFollowing: boolean) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const url = `${API_URL}/users/${targetUserId}/follow`;
    const method = isFollowing ? "DELETE" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!response.ok) return {error: "Failed to update follow"};

        revalidatePath("/feed");
        return {success: true};
    } catch (err) {
        return {error: "Connection error"};
    }
}

export async function toggleRetweet(postId: number, isRetweeted: boolean) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const url = `${API_URL}/retweets`;
    const method = isRetweeted ? "DELETE" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({postId})
        });

        if (!res.ok) return {error: "Action failed"};

        revalidatePath("/feed");
        return {success: true};
    } catch (e) {
        return {error: "Network error"};
    }
}

export async function createComment(postId: number, content: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    try {
        const res = await fetch(`${API_URL}/comments/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (!res.ok) return { error: "Failed to post comment" };

        revalidatePath("/feed");
        return { success: true };
    } catch (e) {
        return { error: "Network error" };
    }
}