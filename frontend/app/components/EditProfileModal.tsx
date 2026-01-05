"use client";

import { useState, useRef } from "react";

export default function EditProfileModal({ user, currentUserId, isOpen, onClose }: any) {
    const [bio, setBio] = useState(user.bio || "");
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        user.avatarUrl ? `http://localhost:3000${user.avatarUrl}` : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("bio", bio);
        if (selectedFile) {
            formData.append("avatar", selectedFile);
        }

        try {
            const res = await fetch(`http://localhost:3000/users/${currentUserId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                window.location.reload();
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white text-2xl">×</button>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className="w-24 h-24 bg-blue-500 rounded-full border-2 border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-3xl font-bold text-white uppercase"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                user.username.charAt(0)
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm font-bold text-blue-500 hover:text-blue-600"
                        >
                            Change Profile Photo
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">BIO</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-[15px]"
                            placeholder="Tell the world about yourself..."
                            maxLength={160}
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">{bio.length}/160</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}