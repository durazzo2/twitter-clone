"use client";

import {useActionState} from "react";
import {register} from "@/app/lib/actions";
import Link from "next/link";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(register, null);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div
                className="w-full max-w-md bg-white dark:bg-black p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">T</span>
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-center mb-2 text-black dark:text-white">
                    Create an Account
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                    Sign up to join the conversation
                </p>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Username
                        </label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Your handle (e.g., johndoe)"
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-black dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Email address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-black dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-black dark:text-white"
                        />
                    </div>

                    {state?.error && (
                        <div
                            className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md"
                    >
                        {isPending ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
