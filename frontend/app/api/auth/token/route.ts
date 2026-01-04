import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value; // or "token" depending on your cookie name
    return NextResponse.json({ token });
}