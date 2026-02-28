'use client';

import { useWebRTC } from '@/hooks/useLiveSocket';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, User,
    Sparkles, Radio, ShieldCheck, Settings, Maximize2
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

    // 1. Atribuir streams aos elementos de vídeo
    useEffect(() => {
        if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    }, [remoteStream]);

    // ================= LÓGICA DE CONTROLO DE HARDWARE =================

    // Controlo de Áudio (Mute)
    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted; // Desliga a track de áudio
            });
        }
    }, [isMuted, localStream]);

    // Controlo de Vídeo (Câmera)
    useEffect(() => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff; // Desliga a track de vídeo
            });
        }
    }, [isVideoOff, localStream]);

    // =================================================================

    const handleEndCall = () => {
        // Para todas as tracks antes de sair para libertar a câmera/microfone
        localStream?.getTracks().forEach(track => track.stop());
        router.push('/');
    };

    return (
        <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-gold/30">

            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl z-[100] px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                        <Radio size={22} className="text-white animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black uppercase tracking-tighter text-white">Live Session</h1>
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gold">PLATINUM</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">ROOM: {roomId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">P2P Encrypted</span>
                    </div>
                </div>
            </header>

            {/* ÁREA DE VÍDEO */}
            <main className="flex-1 pt-24 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

                {/* VÍDEO REMOTO */}
                <div className="relative group aspect-video bg-white/[0.02] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl transition-all">
                    {remoteStream ? (
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-950">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                                <User size={48} className="text-slate-700" />
                            </div>
                            <p className="text-gold font-black uppercase tracking-widest text-xs">Waiting for partner...</p>
                        </div>
                    )}
                </div>

                {/* VÍDEO LOCAL (MESTRE) */}
                <div className="relative group aspect-video bg-white/[0.02] rounded-[32px] border-2 border-gold/20 overflow-hidden shadow-2xl transition-all">
                    {/* Overlay caso a câmera esteja desligada */}
                    {isVideoOff && (
                        <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 text-gold">
                                <VideoOff size={32} />
                            </div>
                            <p className="text-gold font-black uppercase tracking-widest text-[10px]">Câmera Desativada</p>
                        </div>
                    )}

                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />

                    <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-gold px-4 py-2 rounded-2xl shadow-lg">
                        <Sparkles size={14} className="text-white" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Tu (Mestre)</span>
                    </div>
                </div>
            </main>

            {/* CONTROLES */}
            <footer className="fixed bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent flex justify-center items-center z-[100]">
                <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-[28px] border border-white/10 backdrop-blur-2xl">

                    {/* Botão Mic */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-2xl transition-all border ${isMuted ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-lg shadow-red-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    {/* Botão Sair */}
                    <button
                        onClick={handleEndCall}
                        className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-black transition-all hover:-translate-y-1 shadow-xl shadow-red-900/40"
                    >
                        <PhoneOff size={24} className="text-white" />
                        <span className="text-white uppercase tracking-tighter hidden md:block">Encerrar Aula</span>
                    </button>

                    {/* Botão Vídeo */}
                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-4 rounded-2xl transition-all border ${isVideoOff ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-lg shadow-red-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}`}
                    >
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                </div>
            </footer>

            <style jsx>{`
                .mirror { transform: scaleX(-1); }
            `}</style>
        </div>
    );
}
