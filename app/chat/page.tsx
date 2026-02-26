'use client';

import { useEffect, useState } from 'react';
import { ChatBox } from '@/components/chat/ChatBox';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthWallModal from '@/components/modals/AuthWallModal';

export default function ChatPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        // Encapsulamos a lógica para evitar o aviso do linter
        const checkAuth = () => {
            const token = localStorage.getItem('nonhande_token');
            const storedUserId = localStorage.getItem('user_id');

            if (!token) {
                setShowAuthModal(true);
            } else {
                setUserId(storedUserId || 'utilizador_logado');
            }

            // Garantimos que o loading só sai DEPOIS de decidirmos o estado da auth
            setIsCheckingAuth(false);
        };

        checkAuth();
    }, []);

    const { messages, sendMessage, sendVoice, isLoading, speak } = useChat(userId || '');

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        );
    }

    return (
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">
            {showAuthModal && <AuthWallModal />}

            <div className="absolute top-4 left-4 z-10">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-sm text-foreground/70 hover:text-gold transition-all">
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider italic">Sair</span>
                </Link>
            </div>

            <main className={`flex-1 overflow-y-auto px-6 pt-24 pb-10 scrollbar-hide ${showAuthModal ? 'blur-2xl opacity-20' : ''}`}>
                <div className="max-w-3xl mx-auto">
                    <ChatBox
                        messages={messages}
                        onSpeak={(text) => speak(text)}
                    />
                </div>
            </main>

            {!showAuthModal && (
                <div className="flex-none max-w-3xl w-full mx-auto pb-8 px-6">
                    <ChatInput
                        onSendText={sendMessage}
                        onSendVoice={sendVoice}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}