import { getFeed } from "@/app/lib/api";
import CreatePost from "@/app/components/CreatePost";
import DiscoverySidebar from "@/app/components/DiscoverySidebar";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import ThemeToggle from "@/app/components/ThemeToggle";
import InfiniteFeed from "@/app/components/InfiniteFeed";
import {Search} from "lucide-react"

export default async function FeedPage() {
    const initialPosts = await getFeed(1);

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    let currentUserId: number | null = null;

    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            currentUserId = decoded.sub;
        } catch (e) {
            console.error("JWT decode failed", e);
        }
    }

    return (
        <div className="flex justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white max-w-6xl mx-auto">

            <main className="w-full max-w-2xl border-x border-gray-200 dark:border-gray-800 min-w-0 flex flex-col">

                <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Home</h1>
                    <ThemeToggle />
                </header>

                <CreatePost />


                <div className="flex-1 w-full">
                    <InfiniteFeed
                        initialPosts={initialPosts || []}
                        currentUserId={currentUserId}
                    />
                </div>
            </main>


            <aside className="hidden lg:block w-[350px] p-4">
                <div className="sticky top-4 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-100 dark:bg-gray-900 rounded-full py-2 px-10 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:bg-white dark:focus:bg-black transition-all"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                    </div>

                    <DiscoverySidebar />

                    <div className="px-4 text-xs text-gray-500 space-x-2">
                        <span className="hover:underline cursor-pointer">Terms of Service</span>
                        <span className="hover:underline cursor-pointer">Privacy Policy</span>
                        <p className="mt-2">© 2026 Durazzo Twitter</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}