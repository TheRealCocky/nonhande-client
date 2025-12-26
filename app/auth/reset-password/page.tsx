"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/api";
import { Lock, Eye, EyeOff, Loader2, Sparkles, AlertCircle } from "lucide-react";
import axios from "axios";

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
            setError("Token de recuperação ausente ou expirado.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError("");

        try {
            await authService.resetPassword({ token, password });
            router.push("/auth/signin?reset=success");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Erro ao atualizar senha.");
            } else {
                setError("Erro inesperado ao processar o pedido.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card-custom/30 border border-platinum p-8 rounded-[32px] backdrop-blur-md">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-platinum/20 rounded-2xl text-gold">
                        <Sparkles size={32} />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-center mb-2 uppercase tracking-tighter text-foreground">Nova <span className="text-gold">Senha</span></h1>
                <p className="text-center text-text-secondary text-sm mb-8">Escolha uma credencial forte para o ecossistema.</p>

                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gold ml-1">Nova Senha Secreta</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum group-focus-within:text-gold transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-12 focus:border-gold/50 outline-none transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-gold transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-[11px] font-bold">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        disabled={loading || !token}
                        className="w-full bg-gold text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-gold/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "ATUALIZAR ACESSO"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-gold font-black tracking-widest">CARREGANDO...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}