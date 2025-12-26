"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        // Verifica se o token existe e não é a string "undefined"
        if (token && token !== "undefined") {
            localStorage.setItem("token", token);
            router.push("/");
        } else {
            router.push("/auth/signin?error=token_missing");
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-gold font-black animate-pulse uppercase tracking-widest">
                Finalizando autenticação...
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <CallbackContent />
        </Suspense>
    );
}