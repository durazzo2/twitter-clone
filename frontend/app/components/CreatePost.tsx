"use client";

import { useActionState, useRef, useEffect } from "react";
import { createPost } from "@/app/lib/actions";
import {Image} from "lucide-react"

export default function CreatePost() {
    const [state, formAction, isPending] = useActionState(createPost, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state]);

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <form ref={formRef} action={formAction} className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                    Me
                </div>
                <div className="flex-1">
          <textarea
              name="content"
              placeholder="What's happening?"
              className="w-full bg-transparent border-none text-xl outline-none resize-none text-black dark:text-white placeholder-gray-500"
              rows={2}
          />

                    {state?.error && <p className="text-red-500 text-sm mb-2">{state.error}</p>}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-900">
                        {/* Media Upload Icon Button */}
                        <label className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
                            <Image/>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all disabled:opacity-50"
                        >
                            {isPending ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
