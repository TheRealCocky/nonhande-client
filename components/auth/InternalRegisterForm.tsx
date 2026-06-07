"use client";

import { useState } from "react";
import { User, Mail, Lock, Shield, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/api";
import axios from "axios";

export default function InternalRegisterForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "TEACHER" as "ADMIN" | "TEACHER",
    });
    const [adminSecret, setAdminSecret] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.createInternalUser(formData, adminSecret);
            setSuccess(`${formData.role} "${formData.name}" criado com sucesso!`);
            setFormData({ name: "", email: "", password: "", role: "TEACHER" });
            setAdminSecret("");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Erro ao criar utilizador.");
            } else {
                setError("Erro inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card-custom/30 border border-platinum p-6 md:p-10 rounded-[32px] backdrop-blur-md shadow-2xl relative overflow-hidden w-full max-w-[480px]">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 blur-3xl rounded-full" />

            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                    <Shield size={12} className="text-gold" />
                    <span>Acesso Restrito</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                    Criar <span className="text-gold">Utilizador Interno</span>
                </h2>
                <p className="text-text-secondary text-xs mt-1">Apenas administradores podem criar contas internas.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-500 text-xs font-bold">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ROLE SELECTOR */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-1 tracking-wider">Tipo de Conta</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(["TEACHER", "ADMIN"] as const).map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setFormData({ ...formData, role })}
                                className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider border transition-all ${
                                    formData.role === role
                                        ? "bg-gold text-white border-gold shadow-lg shadow-gold/20"
                                        : "bg-background border-platinum text-text-secondary hover:border-gold/40"
                                }`}
                            >
                                {role === "ADMIN" ? "👑 Admin" : "🎓 Teacher"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* NOME */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-1 tracking-wider">Nome</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={16} />
                        <input
                            required
                            type="text"
                            placeholder="Nome completo"
                            value={formData.name}
                            className="w-full bg-background border border-platinum rounded-2xl py-4 pl-11 pr-4 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-1 tracking-wider">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={16} />
                        <input
                            required
                            type="email"
                            placeholder="email@nonhande.ao"
                            value={formData.email}
                            className="w-full bg-background border border-platinum rounded-2xl py-4 pl-11 pr-4 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-1 tracking-wider">Senha</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={16} />
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            className="w-full bg-background border border-platinum rounded-2xl py-4 pl-11 pr-4 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                {/* ADMIN SECRET */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-1 tracking-wider">Chave Secreta de Admin</label>
                    <div className="relative group">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-gold transition-colors" size={16} />
                        <input
                            required
                            type="password"
                            placeholder="••••••••••••"
                            value={adminSecret}
                            className="w-full bg-background border border-platinum rounded-2xl py-4 pl-11 pr-4 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                            onChange={(e) => setAdminSecret(e.target.value)}
                        />
                    </div>
                    <p className="text-[10px] text-text-secondary ml-1">Necessária para autorizar a criação de contas internas.</p>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gold text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-gold/20 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 uppercase tracking-tighter disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>CRIAR CONTA <ArrowRight size={18} /></>}
                </button>
            </form>
        </div>
    );
}