
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { FileText, Plus, LogOut, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface Document {
    id: string;
    file_name: string;
}

export function Sidebar() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createSupabaseBrowserClient();

    // Load documents on mount
    useEffect(() => {
        async function loadDocs() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("documents")
                .select("id, file_name")
                .eq("user_id", user.id)
                .order("id", { ascending: false });

            if (data) setDocuments(data);
        }
        loadDocs();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const { documentId } = await res.json();
                // Optimistic update
                setDocuments(prev => [{ id: documentId, file_name: file.name }, ...prev]);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent opening the doc when clicking delete
        if (!confirm("Are you sure you want to delete this document?")) return;

        // Optimistic update
        setDocuments(prev => prev.filter(d => d.id !== id));

        try {
            const res = await fetch("/api/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentId: id }),
            });

            if (!res.ok) {
                // Revert if failed
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from("documents")
                        .select("id, file_name")
                        .eq("user_id", user.id)
                        .order("id", { ascending: false });
                    if (data) setDocuments(data);
                }
                alert("Failed to delete document");
            }
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete document");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="w-80 h-screen bg-black border-r border-white/10 flex flex-col hidden md:flex">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-center">
                <Image
                    src="/logo.svg"
                    alt="askmydocs"
                    width={150}
                    height={40}
                    className="w-32 h-auto"
                    priority
                />
            </div>

            {/* Upload Button */}
            <div className="p-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept=".pdf,.docx,.txt"
                    onChange={handleUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-gray-200 text-black font-medium transition-all shadow-lg disabled:opacity-50"
                >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    <span>New Document</span>
                </button>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Library</h3>
                {documents.map((doc, i) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="w-4 h-4 shrink-0 text-white" />
                            <span className="text-sm truncate">{doc.file_name}</span>
                        </div>
                        <button
                            onClick={(e) => handleDelete(e, doc.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </motion.div>
                ))}
                {documents.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-600 text-sm italic">
                        No documents yet.
                    </div>
                )}
            </div>

            {/* Footer / User */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                </button>
            </div>
        </div>
    );
}
