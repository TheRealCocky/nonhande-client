"use client";

import { useState } from "react";
import { authService } from "@/services/api";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao solicitar recuperação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card-custom/30 border border-platinum p-8 rounded-[32px] backdrop-blur-md">
                <Link href="/auth/signin" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold mb-8 transition-colors text-sm font-bold">
                    <ArrowLeft size={16} /> Voltar ao Login
                </Link>

                {!sent ? (
                    <>
                        <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">Esqueceu a <span className="text-gold">Senha?</span></h1>
                        <p className="text-text-secondary mb-8 text-sm">Insira o seu e-mail e enviaremos um link de recuperação platinado.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gold ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="teu-email@exemplo.com"
                                        className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-4 focus:border-gold outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                            <button
                                disabled={loading}
                                className="w-full bg-gold text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-gold/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "ENVIAR LINK"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-gold" />
                        </div>
                        <h2 className="text-2xl font-black mb-4 uppercase">E-mail Enviado!</h2>
                        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                            Verifica a tua caixa de entrada (e o spam). O link de recuperação expira em 15 minutos.
                        </p>
                        <Link href="/auth/signin" className="text-gold font-black uppercase text-xs tracking-widest hover:underline">
                            Voltar ao Início
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}