"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const role = searchParams.get("role");

        // Verificamos se o token é válido
        if (token && token !== "undefined") {
            // USAR A CHAVE CORRETA QUE DEFINISTE
            localStorage.setItem("nonhande_token", token);

            // É VITAL guardar o role também para as permissões
            if (role) {
                localStorage.setItem("user_role", role);
            }

            // Redireciona para a home e força o refresh da Navbar
            window.location.href = "/";
        } else {
            router.push("/auth/signin?error=token_missing");
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-gold animate-spin opacity-20" />
                <Sparkles className="w-8 h-8 text-gold animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-gold font-black uppercase tracking-[0.4em] text-xs animate-pulse">
                    Autenticando Legado
                </h2>
                <p className="text-silver-dark text-[10px] uppercase font-bold tracking-widest">
                    Sincronizando com o Acervo...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-1 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}