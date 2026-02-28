'use client';

import { useWebRTC } from '@/hooks/useLiveSocket';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, User,
    Sparkles, Radio, ShieldCheck, Copy, Check
} from 'lucide-react';

export default function LiveRoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const { localStream, remoteStream } = useWebRTC(roomId);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    }, [remoteStream]);

    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted, localStream]);

    useEffect(() => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }, [isVideoOff, localStream]);

    // Função para copiar o ID
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEndCall = () => {
        localStream?.getTracks().forEach(track => track.stop());
        router.push('/live');
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden transition-colors duration-500">

            {/* HEADER - Agora com ID completo e Copiar */}
            <header className="fixed top-0 left-0 w-full h-20 border-b border-border bg-background/80 backdrop-blur-xl z-[100] px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/20 shrink-0">
                        <Radio size={22} className="text-white animate-pulse" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm md:text-lg font-black uppercase tracking-tighter truncate">Live Session</h1>
                            <span className="hidden xs:block bg-gold/10 border border-gold/20 px-1.5 py-0.5 rounded text-[8px] font-bold text-gold shrink-0">PLATINUM</span>
                        </div>
                        {/* Container do ID com Cópia */}
                        <div className="flex items-center gap-2 mt-0.5">
                            <code className="text-[10px] md:text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-0.5 rounded border border-border truncate max-w-[150px] sm:max-w-none">
                                {roomId}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className={`p-1.5 rounded-lg transition-all border ${copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-background border-border text-muted-foreground hover:text-gold'}`}
                                title="Copiar ID da Sala"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shrink-0 ml-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hidden sm:block">Encrypted</span>
                </div>
            </header>

            {/* ÁREA DE VÍDEO */}
            <main className="flex-1 pt-24 pb-32 px-4 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-center overflow-y-auto">
                {/* VÍDEO REMOTO */}
                <div className="relative aspect-video bg-secondary rounded-[24px] md:rounded-[32px] border border-border overflow-hidden shadow-2xl">
                    {remoteStream ? (
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/50">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-background rounded-full flex items-center justify-center border border-border animate-pulse">
                                <User size={32} className="text-muted-foreground" />
                            </div>
                            <p className="text-gold font-black uppercase tracking-widest text-[10px]">Aguardando Aluno...</p>
                        </div>
                    )}
                </div>

                {/* VÍDEO LOCAL (MESTRE) */}
                <div className="relative aspect-video bg-secondary rounded-[24px] md:rounded-[32px] border-2 border-gold/30 overflow-hidden shadow-2xl">
                    {isVideoOff && (
                        <div className="absolute inset-0 z-10 bg-background/90 flex flex-col items-center justify-center gap-3">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 text-gold">
                                <VideoOff size={24} />
                            </div>
                            <p className="text-gold font-black uppercase tracking-widest text-[9px]">Câmara Desligada</p>
                        </div>
                    )}
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-gold px-3 py-1.5 rounded-xl shadow-lg">
                        <Sparkles size={12} className="text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Mestre</span>
                    </div>
                </div>
            </main>

            {/* CONTROLES */}
            <footer className="fixed bottom-0 left-0 w-full h-24 md:h-28 bg-gradient-to-t from-background via-background/90 to-transparent flex justify-center items-center z-[100] px-4">
                <div className="flex items-center gap-3 md:gap-4 bg-card/80 p-3 md:p-4 rounded-[24px] border border-border backdrop-blur-2xl shadow-2xl">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-xl md:rounded-2xl transition-all border active:scale-90 ${isMuted ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-secondary border-border text-foreground'}`}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="group flex items-center gap-2 md:gap-3 bg-red-600 hover:bg-red-700 px-6 md:px-10 py-4 rounded-xl md:rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-red-600/20 text-white"
                    >
                        <PhoneOff size={20} />
                        <span className="uppercase tracking-tighter text-xs md:text-sm hidden sm:block">Terminar</span>
                    </button>
                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-4 rounded-xl md:rounded-2xl transition-all border active:scale-90 ${isVideoOff ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-secondary border-border text-foreground'}`}
                    >
                        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>
                </div>
            </footer>
        </div>
    );
}
