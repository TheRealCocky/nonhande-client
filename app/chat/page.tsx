'use client';

import { useEffect, useState } from 'react';
import { ChatBox } from '@/components/chat/ChatBox';
import { ChatInput } from '@/components/chat/ChatInput';
import { VoiceModeOverlay } from '@/components/chat/VoiceModeOverlay';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { useChat } from '@/hooks/useChat';
import { useAgentStore } from '@/store/useAgentStore';
import { X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthWallModal from '@/components/modals/AuthWallModal';

export default function ChatPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    const { selectedAgent } = useAgentStore();
    const { messages, sendMessage, sendVoice, isLoading, speak } = useChat(userId || '');

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('nonhande_token');
            const storedUserId = localStorage.getItem('user_id');
            if (!token) {
                setShowAuthModal(true);
            } else {
                setUserId(storedUserId || 'utilizador_logado');
            }
            setIsCheckingAuth(false);
        };
        checkAuth();

        // ✨ OBRIGATÓRIO: Trava o body para o teclado não empurrar a página inteira
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
        };
    }, []);

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        );
    }

    return (
        /* 1. CONTAINER PAI: fixed inset-0 para não sair do lugar */
        <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden">
            {showAuthModal && <AuthWallModal />}

            <VoiceModeOverlay
                isOpen={isVoiceMode}
                onClose={() => setIsVoiceMode(false)}
                isLoading={isLoading}
                agentName={selectedAgent}
            />

            {/* 2. HEADER: Agora é flex-none (não encolhe) e relativo ao fluxo */}
            <header className={`flex-none w-full p-4 z-50 transition-all duration-300 ${
                isVoiceMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
                <div className="max-w-3xl mx-auto flex items-center">
                    <Link href="/" className="flex items-center justify-center w-10 h-10 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-lg text-foreground/70">
                        <X size={20} />
                    </Link>
                </div>
            </header>

            {/* 3. ÁREA DE CONTEÚDO: O 'flex-1' faz com que ela se ajuste automaticamente ao teclado */}
            <main className={`flex-1 overflow-y-auto relative transition-all duration-500 ${
                showAuthModal || isVoiceMode ? 'blur-2xl opacity-20 pointer-events-none' : 'opacity-100'
            }`}>
                <div className="max-w-3xl mx-auto px-4 py-2">
                    {messages.length === 0 && !isLoading ? (
                        <div className="min-h-[60vh] flex items-center justify-center">
                            <WelcomeScreen onActionClick={(text) => sendMessage(text, selectedAgent)} />
                        </div>
                    ) : (
                        <ChatBox
                            messages={messages}
                            onSpeak={(text) => speak(text)}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </main>

            {/* 4. FOOTER/INPUT: flex-none para manter o tamanho e pb-safe-bottom para iPhones */}
            {!showAuthModal && (
                <footer className={`flex-none w-full transition-transform duration-500 ${
                    isVoiceMode ? 'translate-y-full' : 'translate-y-0'
                }`}>
                    <div className="max-w-3xl mx-auto px-4 pb-6 md:pb-8 pt-2">
                        <ChatInput
                            onSendText={sendMessage}
                            onSendVoice={sendVoice}
                            isLoading={isLoading}
                            onToggleVoiceMode={() => setIsVoiceMode(true)}
                        />
                    </div>
                </footer>
            )}
        </div>
    );
}
