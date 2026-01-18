
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const supabase = createSupabaseBrowserClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            }
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push("/");
                router.refresh();
            } else {
                setError("Confirmation link sent! Please check your email.");
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-black">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden border-r border-white/5">

                <div className="relative z-10 p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex justify-center mb-8">
                            <Image
                                src="/logo.svg"
                                alt="askmydocs"
                                width={300}
                                height={100}
                                className="w-56 h-auto"
                                priority
                            />
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-8">Join the Future</h1>

                        <div className="space-y-4 text-left max-w-sm mx-auto">
                            {[
                                "Unlimited Document Processing",
                                "Advanced AI Analysis",
                                "Secure Data Encryption",
                                "Instant Answers"
                            ].map((feature, i) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-gray-400"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                    <span className="text-lg">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-gray-400">Start your journey with us today</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSignup}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-gray-600 focus:border-white/50 focus:ring-0 transition-all outline-none"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-gray-600 focus:border-white/50 focus:ring-0 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className={`p-3 rounded-lg border text-sm text-center ${error.includes("sent")
                                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                                            : "bg-red-500/10 border-red-500/20 text-red-400"
                                        }`}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>Sign Up <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500">
                                Already have an account?{" "}
                                <Link href="/login" className="text-white hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
