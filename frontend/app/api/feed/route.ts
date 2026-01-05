import { getFeed } from "@/app/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    const data = await getFeed(page);
    return NextResponse.json({ data });
}