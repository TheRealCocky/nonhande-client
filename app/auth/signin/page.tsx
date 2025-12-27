"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await authService.login(formData);

            // 1. Pegar o Token e o Role (Cargo) da resposta do servidor
            // O teu Backend devolve: { accessToken: "...", user: { role: "ADMIN", ... } }
            const token = data.accessToken;
            const role = data.user?.role;

            // 2. GUARDAR COM OS NOMES CERTOS (Igual ao que o api.ts e a DicionarioPage esperam)
            localStorage.setItem("nonhande_token", token); // Antes era apenas "token"
            localStorage.setItem("user_role", role);       // Faltava guardar isto!

            // 3. Redirecionar
            router.push("/"); // Mudei para ir direto ao dicionário ver o resultado!
            router.refresh();
        } catch (err: unknown) {
            const defaultMsg = "Erro de conexão com o servidor.";

            if (axios.isAxiosError(err)) {
                const backendMsg = err.response?.data?.message || defaultMsg;
                const status = err.response?.status;

                const isNotVerified = backendMsg.toLowerCase().includes("verified") ||
                    (status === 401 && backendMsg.includes("verify"));

                if (isNotVerified) {
                    setError("Sua conta ainda não foi ativada. Verifique o seu e-mail.");
                } else {
                    setError(status === 401 ? "E-mail ou senha incorretos." : backendMsg);
                }
            } else {
                setError(defaultMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-[420px] space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <Sparkles size={14} className="text-gold" />
                        <span>Acesso Membro</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
                        Bem-vindo <span className="text-gold">De Volta</span>
                    </h1>
                </div>

                <div className="bg-card-custom/30 border border-platinum p-6 md:p-10 rounded-[32px] backdrop-blur-md shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 blur-3xl rounded-full" />

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-[11px] font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => authService.googleLogin()}
                        className="w-full flex items-center justify-center gap-3 bg-background border border-platinum py-4 rounded-2xl font-bold hover:bg-platinum/20 transition-all mb-6 text-sm group"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                        <span>Entrar com Google</span>
                    </button>

                    <div className="relative mb-8 text-center">
                        <span className="bg-background px-4 text-[10px] font-black uppercase text-text-secondary relative z-10 tracking-widest">Ou credenciais</span>
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-platinum" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase ml-1 tracking-wider">E-mail Corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={18} />
                                <input
                                    required
                                    type="email"
                                    placeholder="teu@email.com"
                                    className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-wider">Senha Secreta</label>
                                <Link href="/auth/forgot-password" className="text-[10px] font-bold text-gold uppercase hover:underline">
                                    Esqueceu?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={18} />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-platinum rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gold/50 transition-all text-sm"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-gold text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-gold/20 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 uppercase tracking-tighter disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Entrar <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p className="text-center text-xs text-text-secondary mt-10 font-medium">
                        Ainda não faz parte? <Link href="/auth/signup" className="text-gold font-black hover:underline uppercase ml-1">Criar conta</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}