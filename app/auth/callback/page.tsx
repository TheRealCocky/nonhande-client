"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { storage } from "@/app/utils/storage";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const role = searchParams.get("role");
        const userId = searchParams.get("userId"); 

        if (token && token !== "undefined") {
            storage.set("nonhande_token", token);
            if (role) storage.set("user_role", role);
            if (userId) {
                storage.set("user_id", userId);
                console.log("✅ Google login — ID capturado:", userId);
            } else {
                console.warn("⚠️ Google callback não enviou userId na URL");
            }

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