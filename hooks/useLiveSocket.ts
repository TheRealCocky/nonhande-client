'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Interface para garantir que os dados de sinalização cheguem no formato certo
interface SignalingData {
    toRoom?: string;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
}

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useWebRTC = (roomId: string) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!roomId) return;

        // 1. Inicializa o Socket
        const socket = io(`${process.env.NEXT_PUBLIC_LIVE_URL}/live`, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        const init = async () => {
            try {
                // 2. Captura Mídia
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);

                // 3. Configura Peer Connection
                const peer = new RTCPeerConnection(ICE_SERVERS);
                pc.current = peer;

                // Adiciona tracks locais
                stream.getTracks().forEach(track => peer.addTrack(track, stream));

                // Callback para stream remoto
                peer.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        console.log("🎬 Stream remoto detetado!");
                        setRemoteStream(event.streams[0]);
                    }
                };

                // Envia candidatos ICE para o outro peer
                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', {
                            toRoom: roomId,
                            candidate: event.candidate
                        });
                    }
                };

                // 4. Fluxo de Sinalização (Handshake)
                socket.on('user-joined', async () => {
                    console.log("👤 Aluno entrou. A criar oferta...");
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socket.emit('offer', { toRoom: roomId, offer });
                });

                socket.on('offer', async (data: SignalingData) => {
                    if (!data.offer) return;
                    console.log("📩 Oferta recebida. A responder...");
                    await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);
                    socket.emit('answer', { toRoom: roomId, answer });
                });

                socket.on('answer', async (data: SignalingData) => {
                    if (!data.answer) return;
                    console.log("✅ Conexão aceite.");
                    await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
                });

                // CORREÇÃO CRÍTICA: Tratamento seguro de ICE Candidates
                socket.on('ice-candidate', async (data: SignalingData) => {
                    const candidateData = data.candidate;
                    if (candidateData && pc.current) {
                        try {
                            // Só adicionamos o candidato se já tivermos uma descrição remota
                            // Caso contrário, o WebRTC rejeita por questões de segurança/protocolo
                            if (pc.current.remoteDescription) {
                                await pc.current.addIceCandidate(candidateData);
                            } else {
                                console.warn("⏳ ICE recebido antes da RemoteDescription. Ignorado para evitar crash.");
                            }
                        } catch (e) {
                            console.error("Maka ao processar ICE Candidate:", e);
                        }
                    }
                });

                // 5. Entra na sala
                socket.emit('join-room', { roomId });

            } catch (err) {
                console.error("❌ Maka fatal no WebRTC:", err);
            }
        };

        init();

        // 6. Cleanup (Limpeza Total)
        return () => {
            console.log("🔌 Encerrando sessão de Live...");

            socket.off('user-joined');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.disconnect();

            if (pc.current) {
                pc.current.getSenders().forEach(sender => {
                    if (sender.track) sender.track.stop();
                });
                pc.current.close();
                pc.current = null;
            }

            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    return { localStream, remoteStream };
};