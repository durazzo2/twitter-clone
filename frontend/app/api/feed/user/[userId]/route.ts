// app/api/feed/user/[userId]/route.ts
import { getUserPosts } from "@/app/lib/api";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> } // In Next 15, params is a Promise
) {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    const posts = await getUserPosts(parseInt(userId), page);
    return NextResponse.json({ data: posts });
}