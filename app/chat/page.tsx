'use client';

import { useEffect, useState, useRef } from 'react';
import { ChatBox } from '@/components/chat/ChatBox';
import { ChatInput } from '@/components/chat/ChatInput';
import { VoiceModeOverlay } from '@/components/chat/VoiceModeOverlay';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { useChat } from '@/hooks/useChat';
import { useAgentStore } from '@/store/useAgentStore';
import { useVoice } from '@/hooks/useVoice'; // ✨ IMPORTADO AQUI
import { X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthWallModal from '@/components/modals/AuthWallModal';

export default function ChatPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [viewportHeight, setViewportHeight] = useState('100dvh');

    const { selectedAgent } = useAgentStore();
    const { messages, sendMessage, sendVoice, isLoading, speak } = useChat(userId || '');

    // ✨ LÓGICA DE VOZ ELEVADA: Agora a página controla o microfone
    const { isRecording, startRecording, stopRecording } = useVoice();

    // ✨ Função que o Overlay vai usar sem dar erro de "undefined"
    const toggleVoiceRecording = async () => {
        if (isRecording) {
            const audioBlob = await stopRecording();
            if (audioBlob) sendVoice(audioBlob, selectedAgent);
        } else {
            await startRecording();
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('nonhande_token');
            const storedUserId = localStorage.getItem('user_id');
            if (!token) { setShowAuthModal(true); }
            else { setUserId(storedUserId || 'utilizador_logado'); }
            setIsCheckingAuth(false);
        };
        checkAuth();

        const onResize = () => {
            if (window.visualViewport) {
                setViewportHeight(`${window.visualViewport.height}px`);
                window.scrollTo(0, 0);
            }
        };

        window.visualViewport?.addEventListener('resize', onResize);
        window.visualViewport?.addEventListener('scroll', onResize);

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        return () => {
            window.visualViewport?.removeEventListener('resize', onResize);
            window.visualViewport?.removeEventListener('scroll', onResize);
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
        <div
            style={{ height: viewportHeight, top: 0, left: 0, position: 'fixed' }}
            className="w-full flex flex-col bg-background text-foreground overflow-hidden"
        >
            {showAuthModal && <AuthWallModal />}

            {/* ✨ AGORA PASSAMOS AS FUNÇÕES REAIS PARA O OVERLAY */}
            <VoiceModeOverlay
                isOpen={isVoiceMode}
                onClose={() => {
                    setIsVoiceMode(false);
                    if (isRecording) stopRecording();
                    window.speechSynthesis.cancel(); // ✨ Garante que cala ao fechar o modo
                }}
                isLoading={isLoading}
                agentName={selectedAgent}
                isRecording={isRecording}
                toggleRecording={toggleVoiceRecording}
                onStopSpeaking={() => window.speechSynthesis.cancel()}
            />

            <header className={`flex-none w-full p-4 z-50 ${isVoiceMode ? 'hidden' : 'block'}`}>
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center justify-center w-10 h-10 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-lg">
                        <X size={20} />
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/50">{selectedAgent}</span>
                </div>
            </header>

            <main className={`flex-1 overflow-y-auto px-4 scrollbar-hide ${showAuthModal || isVoiceMode ? 'blur-2xl opacity-20' : 'opacity-100'}`}>
                <div className="max-w-3xl mx-auto py-2 flex flex-col min-h-full">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <WelcomeScreen onActionClick={(text) => sendMessage(text, selectedAgent)} />
                        </div>
                    ) : (
                        <ChatBox messages={messages} onSpeak={(text) => speak(text)} isLoading={isLoading} />
                    )}
                </div>
            </main>

            {!showAuthModal && (
                <footer className={`flex-none w-full px-4 pt-2 pb-6 transition-all ${isVoiceMode ? 'hidden' : 'block'}`}>
                    <div className="max-w-3xl mx-auto">
                        <ChatInput
                            onSendText={sendMessage}
                            onSendVoice={sendVoice}
                            isLoading={isLoading}
                            onToggleVoiceMode={() => setIsVoiceMode(true)}
                            // ✨ PASSAMOS O ESTADO PARA O INPUT NÃO PRECISAR DE useVoice PRÓPRIO
                            isRecording={isRecording}
                            startRecording={startRecording}
                            stopRecording={stopRecording}
                        />
                    </div>
                </footer>
            )}
        </div>
    );
}
