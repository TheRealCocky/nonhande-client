"use client";

import { useState } from "react";
import { User, Mail, Lock, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.signup(formData);
            // Redireciona para a pasta que criaste
            router.push(`/auth/signup/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Ocorreu um erro ao criar a conta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-[450px] space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <Sparkles size={14} className="text-gold" />
                        <span>Nação Nonhande</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Criar <span className="text-gold">Conta</span></h1>
                </div>

                <div className="bg-card-custom/30 border border-platinum p-6 md:p-10 rounded-[32px] backdrop-blur-md shadow-2xl">
                    {/* FEEDBACK DE ERRO PROFISSIONAL */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-bold">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {/* GOOGLE - ESSENCIAL */}
                    <button
                        type="button"
                        onClick={() => authService.googleLogin()}
                        className="w-full flex items-center justify-center gap-3 bg-background border border-platinum py-4 rounded-2xl font-bold hover:bg-platinum/20 transition-all mb-6 text-sm"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span>Registrar com Google</span>
                    </button>

                    <div className="relative mb-6 text-center">
                        <span className="bg-background px-4 text-[10px] font-black uppercase text-text-secondary relative z-10">Ou via Email</span>
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-platinum" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase ml-1">Nome</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={18} />
                                <input required type="text" placeholder="Nome completo" className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gold/50"
                                       onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={18} />
                                <input required type="email" placeholder="teu@email.com" className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gold/50"
                                       onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={18} />
                                <input required type="password" placeholder="••••••••" className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gold/50"
                                       onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-gold text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" /> : <>CRIAR CONTA <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p className="text-center text-xs text-text-secondary mt-8">
                        Já é membro? <Link href="/auth/signin" className="text-gold font-bold hover:underline">ENTRAR AQUI</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}