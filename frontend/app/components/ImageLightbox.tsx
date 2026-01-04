"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

interface LightboxProps {
    src: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageLightbox({ src, isOpen, onClose }: LightboxProps) {

    // Handle Keyboard Shortcuts (Esc key)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Optional: Prevent background scrolling when image is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-zoom-out"
                >
                    <button
                        className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110]"
                        onClick={onClose}
                    >
                        <X size={32} />
                    </button>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative max-w-[95vw] max-h-[95vh]"
                        onClick={(e) => e.stopPropagation()} // Stop click from closing when clicking image itself
                    >
                        <img
                            src={src}
                            alt="Expanded view"
                            className="rounded-lg shadow-2xl object-contain max-h-[95vh] pointer-events-none select-none"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}