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

    // ✨ ESTADO CRÍTICO: Altura dinâmica para o teclado mobile
    const [viewportHeight, setViewportHeight] = useState('100dvh');

    const { selectedAgent } = useAgentStore();
    const { messages, sendMessage, sendVoice, isLoading, speak } = useChat(userId || '');

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('nonhande_token');
            const storedUserId = localStorage.getItem('user_id');
            if (!token) { setShowAuthModal(true); }
            else { setUserId(storedUserId || 'utilizador_logado'); }
            setIsCheckingAuth(false);
        };
        checkAuth();

        // ✨ PADRÃO GROK: Sincronizar altura com o Visual Viewport (Teclado)
        const onResize = () => {
            if (window.visualViewport) {
                // Ajusta a altura da aplicação exatamente para o espaço sobrando acima do teclado
                setViewportHeight(`${window.visualViewport.height}px`);
            }
        };

        window.visualViewport?.addEventListener('resize', onResize);
        window.visualViewport?.addEventListener('scroll', onResize);

        // Bloqueia scroll do body mas mantém flexibilidade
        document.body.style.overflow = 'hidden';

        return () => {
            window.visualViewport?.removeEventListener('resize', onResize);
            window.visualViewport?.removeEventListener('scroll', onResize);
            document.body.style.overflow = 'auto';
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
        /* 1. O PAI agora usa a altura dinâmica calculada pelo Viewport */
        <div
            style={{ height: viewportHeight }}
            className="fixed top-0 left-0 w-full flex flex-col bg-background text-foreground overflow-hidden"
        >
            {showAuthModal && <AuthWallModal />}

            <VoiceModeOverlay
                isOpen={isVoiceMode}
                onClose={() => setIsVoiceMode(false)}
                isLoading={isLoading}
                agentName={selectedAgent}
            />

            {/* 2. HEADER: flex-none para não colapsar */}
            <header className={`flex-none w-full p-4 z-50 transition-opacity ${
                isVoiceMode ? 'opacity-0' : 'opacity-100'
            }`}>
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="flex items-center justify-center w-10 h-10 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-lg">
                        <X size={20} />
                    </Link>
                </div>
            </header>

            {/* 3. MAIN: Scroll automático e flexível */}
            <main className={`flex-1 overflow-y-auto px-4 scrollbar-hide transition-all ${
                showAuthModal || isVoiceMode ? 'blur-2xl opacity-20' : 'opacity-100'
            }`}>
                <div className="max-w-3xl mx-auto py-2">
                    {messages.length === 0 && !isLoading ? (
                        <div className="min-h-[50vh] flex items-center justify-center">
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

            {/* 4. FOOTER: Ocupa apenas o necessário e fica colado no teclado */}
            {!showAuthModal && (
                <footer className={`flex-none w-full px-4 pt-2 pb-4 transition-transform ${
                    isVoiceMode ? 'translate-y-full' : 'translate-y-0'
                }`}>
                    <div className="max-w-3xl mx-auto">
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
