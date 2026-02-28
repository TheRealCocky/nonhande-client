'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Servidores STUN da Google (Essenciais para conexões fora da rede local em Angola)
const ICE_SERVERS = {
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

        // 1. Conexão ao Microserviço de Live
        const socket = io(`${process.env.NEXT_PUBLIC_LIVE_URL}/live`, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        const init = async () => {
            try {
                // 2. Permissões de Câmera e Áudio
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);

                // 3. Configuração do Peer-to-Peer
                const peer = new RTCPeerConnection(ICE_SERVERS);
                pc.current = peer;

                // Mapeia os tracks locais (vídeo/áudio) para a conexão
                stream.getTracks().forEach(track => peer.addTrack(track, stream));

                // Quando o vídeo do outro utilizador chegar
                peer.ontrack = (event) => {
                    console.log("🎬 Stream remoto detetado!");
                    setRemoteStream(event.streams[0]);
                };

                // Envia dados de rede (ICE) através do Socket
                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', { toRoom: roomId, candidate: event.candidate });
                    }
                };

                // 4. Lógica de Sinalização (O "aperto de mão" WebRTC)
                socket.on('user-joined', async () => {
                    console.log("👤 Aluno entrou. A criar oferta...");
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socket.emit('offer', { toRoom: roomId, offer });
                });

                socket.on('offer', async (data) => {
                    console.log("📩 Oferta recebida. A responder...");
                    await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);
                    socket.emit('answer', { toRoom: roomId, answer });
                });

                socket.on('answer', async (data) => {
                    console.log("✅ Conexão aceite.");
                    await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
                });

                socket.on('ice-candidate', async (data: any) => {
                    const candidate = data.candidate || data;
                    if (candidate) {
                        await peer.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });

                // 5. Entrar na sala virtual no Backend
                socket.emit('join-room', { roomId });

            } catch (err) {
                console.error("❌ Maka fatal no WebRTC:", err);
            }
        };

        init();

        // Limpeza: Desliga tudo ao sair para não gastar bateria/dados
        return () => {
            console.log("🔌 Encerrando sessão de Live...");
            socket.disconnect();
            pc.current?.close();
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    return { localStream, remoteStream };
};