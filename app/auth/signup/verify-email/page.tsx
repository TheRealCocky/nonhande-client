"use client";

import { useState, Suspense } from "react";
import { MailOpen, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/api";
import axios from "axios";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length < 4) {
            setError("Introduz o código completo.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authService.verifyCode(email, code);
            setIsSuccess(true);

            setTimeout(() => {
                router.push("/auth/signin");
            }, 2000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Código inválido ou expirado.");
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-[400px] space-y-8">
                <div className="relative mx-auto w-20 h-20">
                    <div className="absolute -inset-4 bg-gold/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-full h-full bg-card-custom border border-platinum rounded-3xl flex items-center justify-center text-gold shadow-2xl">
                        {isSuccess ? <CheckCircle2 size={40} className="text-green-500" /> : <MailOpen size={40} />}
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                        {isSuccess ? "Conta Verificada!" : "Verifica o teu E-mail"}
                    </h1>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Enviámos um código para <span className="text-foreground font-bold">{email}</span>. <br/>
                        Insere o código abaixo para ativar a tua conta.
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                {!isSuccess && (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-background border-2 border-platinum rounded-2xl py-5 text-center text-3xl font-black tracking-[15px] outline-none focus:border-gold/50 transition-all placeholder:tracking-normal placeholder:text-lg placeholder:font-normal"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-gold text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-gold/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "CONFIRMAR CÓDIGO"}
                        </button>
                    </form>
                )}

                {isSuccess && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold">
                        Sucesso! Redirecionando para o login...
                    </div>
                )}

                <div className="pt-4 flex flex-col gap-4 items-center">
                    <button
                        onClick={() => {}}
                        className="text-[10px] font-black uppercase text-text-secondary hover:text-gold transition-colors tracking-widest"
                    >
                        Não recebi o código? Reenviar
                    </button>

                    <Link href="/auth/signin" className="flex items-center gap-2 text-text-secondary font-bold hover:text-gold transition-colors text-sm uppercase tracking-widest">
                        <ArrowLeft size={16} /> Voltar ao Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-gold font-black">CARREGANDO...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}