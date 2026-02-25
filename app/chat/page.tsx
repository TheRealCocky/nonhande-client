'use client';

'use client';

import { ChatBox } from '@/components/chat/ChatBox';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
    const { messages, sendMessage, sendVoice, isLoading } = useChat();

    return (
        /* USAR AS MESMAS CLASSES DA DICIONÁRIO:
           bg-background (Fundo que muda sozinho)
           text-foreground (Texto que muda sozinho)
        */
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">

            {/* 🔙 BOTÃO VOLTAR - Estilo igual ao do teu Dicionário */}
            <div className="absolute top-4 left-4 z-10">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 bg-card-custom/80 backdrop-blur-md border border-border-custom/40 rounded-full shadow-sm text-foreground/70 hover:text-gold transition-all"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider italic">Sair</span>
                </Link>
            </div>

            {/* CONTEÚDO SCROLLÁVEL (Igual ao main do Dicionário) */}
            <main className="flex-1 overflow-y-auto px-6 pt-24 pb-10 scrollbar-hide">
                <div className="max-w-3xl mx-auto">
                    <ChatBox messages={messages} />
                </div>
            </main>

            {/* ZONA DE INPUT (Fixa ao fundo) */}
            <div className="flex-none max-w-3xl w-full mx-auto pb-8 px-6">
                <ChatInput
                    onSendText={sendMessage}
                    onSendVoice={sendVoice}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}