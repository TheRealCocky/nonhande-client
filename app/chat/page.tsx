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

        // ✨ Bloqueia o scroll elástico do body para evitar que a tela "dance" no mobile
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        );
    }

    return (
        /* FIX: 'fixed inset-0' garante que o app ocupe a tela toda sem ser empurrado pelo teclado */
        <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden font-sans">
            {showAuthModal && <AuthWallModal />}

            <VoiceModeOverlay
                isOpen={isVoiceMode}
                onClose={() => setIsVoiceMode(false)}
                isLoading={isLoading}
                agentName={selectedAgent}
            />

            {/* HEADER - z-50 para ficar sempre acima do conteúdo */}
            <div className={`absolute top-safe left-4 pt-4 z-50 transition-opacity duration-300 ${
                isVoiceMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
                <Link href="/" className="flex items-center justify-center w-10 h-10 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-lg text-foreground/70 hover:text-gold transition-all">
                    <X size={20} />
                </Link>
            </div>

            {/* ÁREA DE MENSAGENS - overflow-y-auto permite scroll interno */}
            <main className={`flex-1 overflow-y-auto px-4 md:px-6 pt-24 pb-4 scrollbar-hide transition-all duration-500 ${
                showAuthModal || isVoiceMode ? 'blur-2xl opacity-20 pointer-events-none' : 'opacity-100'
            }`}>
                <div className="max-w-3xl mx-auto">
                    {messages.length === 0 && !isLoading ? (
                        <WelcomeScreen onActionClick={(text) => sendMessage(text, selectedAgent)} />
                    ) : (
                        <ChatBox
                            messages={messages}
                            onSpeak={(text) => speak(text)}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </main>

            {/* INPUT - Stick no fundo com padding seguro para iPhones/Androids novos */}
            {!showAuthModal && (
                <div className={`flex-none w-full max-w-3xl mx-auto px-4 pb-safe-bottom pt-2 transition-transform duration-500 ${
                    isVoiceMode ? 'translate-y-full' : 'translate-y-0'
                }`}>
                    <ChatInput
                        onSendText={sendMessage}
                        onSendVoice={sendVoice}
                        isLoading={isLoading}
                        onToggleVoiceMode={() => setIsVoiceMode(true)}
                    />
                    {/* Espaçador extra para mobile para o input não colar no fundo */}
                    <div className="h-4 md:hidden" />
                </div>
            )}
        </div>
    );
}
