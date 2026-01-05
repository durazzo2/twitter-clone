import Navbar from "@/app/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="max-w-2xl mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen">
                {children}
            </div>
        </div>
    );
}