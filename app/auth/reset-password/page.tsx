"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/api";
import { Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Token de recuperação ausente ou inválido.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError("");

        try {
            await authService.resetPassword({ token, password });
            alert("Sucesso! Palavra-passe atualizada.");
            router.push("/auth/signin");
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao atualizar senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card-custom/30 border border-platinum p-8 rounded-[32px]">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-platinum/20 rounded-2xl text-gold">
                        <Sparkles size={32} />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-center mb-2 uppercase tracking-tighter">Nova <span className="text-gold">Senha</span></h1>
                <p className="text-center text-text-secondary text-sm mb-8">Escolha uma senha forte para proteger a sua conta.</p>

                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gold ml-1">Nova Palavra-passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-12 focus:border-gold outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-gold"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 p-3 rounded-xl">{error}</p>}

                    <button
                        disabled={loading || !token}
                        className="w-full bg-gold text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-gold/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "ATUALIZAR SENHA"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// O Next.js exige Suspense ao usar useSearchParams em Client Components
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-gold font-black">CARREGANDO...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}