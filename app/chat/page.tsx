'use client';

import { useEffect, useState } from 'react';
import { ChatBox } from '@/components/chat/ChatBox';
import { ChatInput } from '@/components/chat/ChatInput';
import { VoiceModeOverlay } from '@/components/chat/VoiceModeOverlay';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'; // Importado corretamente
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
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative font-sans">
            {showAuthModal && <AuthWallModal />}

            {/* 1. MODO DE VOZ (OVERLAY IMERSIVO) */}
            <VoiceModeOverlay
                isOpen={isVoiceMode}
                onClose={() => setIsVoiceMode(false)}
                isLoading={isLoading}
                agentName={selectedAgent}
            />

            {/* 2. HEADER SUTIL */}
            <div className={`absolute top-4 left-4 z-10 transition-opacity duration-300 ${
                isVoiceMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
                <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-sm text-foreground/70 hover:text-gold transition-all">
                    <X size={18} />
                </Link>
            </div>

            {/* 3. ÁREA PRINCIPAL (MENSAGENS OU WELCOME) */}
            <main className={`flex-1 overflow-y-auto px-4 md:px-6 pt-24 pb-10 scrollbar-hide transition-all duration-500 ${
                showAuthModal || isVoiceMode ? 'blur-2xl opacity-20 pointer-events-none' : 'opacity-100'
            }`}>
                <div className="max-w-3xl mx-auto">
                    {/* Lógica de exibição: Se não há mensagens, mostra Welcome. Se há, mostra Chat. */}
                    {messages.length === 0 && !isLoading ? (
                        <WelcomeScreen
                            onActionClick={(text) => sendMessage(text, selectedAgent)}
                        />
                    ) : (
                        <ChatBox
                            messages={messages}
                            onSpeak={(text) => speak(text)}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </main>

            {/* 4. INPUT DE COMANDO */}
            {!showAuthModal && (
                <div className={`flex-none max-w-3xl w-full mx-auto pb-8 px-4 md:px-6 transition-transform duration-500 ${
                    isVoiceMode ? 'translate-y-40' : 'translate-y-0'
                }`}>
                    <ChatInput
                        onSendText={sendMessage}
                        onSendVoice={sendVoice}
                        isLoading={isLoading}
                        onToggleVoiceMode={() => setIsVoiceMode(true)}
                    />
                </div>
            )}
        </div>
    );
}
