'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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

        const socket = io(`${process.env.NEXT_PUBLIC_LIVE_URL}/live`, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        const init = async () => {
            try {
                // AJUSTE CRÍTICO: Configurações para eliminar eco e ruído
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user"
                    },
                    audio: {
                        echoCancellation: true,    // Mata o eco
                        noiseSuppression: true,    // Remove ruído de fundo (ex: ventoinha do PC)
                        autoGainControl: true,     // Estabiliza o volume da voz
                        channelCount: 1            // Mono é melhor para voz em conexões instáveis
                    }
                });

                setLocalStream(stream);

                const peer = new RTCPeerConnection(ICE_SERVERS);
                pc.current = peer;

                stream.getTracks().forEach(track => peer.addTrack(track, stream));

                peer.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        console.log("🎬 Stream remoto detetado!");
                        setRemoteStream(event.streams[0]);
                    }
                };

                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', {
                            toRoom: roomId,
                            candidate: event.candidate
                        });
                    }
                };

                socket.on('user-joined', async () => {
                    console.log("👤 Aluno entrou. A criar oferta...");
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socket.emit('offer', { toRoom: roomId, offer });
                });

                socket.on('offer', async (data: SignalingData) => {
                    if (!data.offer || !pc.current) return;
                    console.log("📩 Oferta recebida. A responder...");
                    await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await pc.current.createAnswer();
                    await pc.current.setLocalDescription(answer);
                    socket.emit('answer', { toRoom: roomId, answer });
                });

                socket.on('answer', async (data: SignalingData) => {
                    if (!data.answer || !pc.current) return;
                    console.log("✅ Conexão aceite.");
                    await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                });

                socket.on('ice-candidate', async (data: SignalingData) => {
                    const rawCandidate = data.candidate;
                    if (rawCandidate && pc.current && pc.current.remoteDescription) {
                        try {
                            const candidateToAdded = new RTCIceCandidate({
                                candidate: rawCandidate.candidate,
                                sdpMid: rawCandidate.sdpMid,
                                sdpMLineIndex: rawCandidate.sdpMLineIndex,
                            });
                            await pc.current.addIceCandidate(candidateToAdded);
                        } catch (e) {
                            console.error("Maka ao processar ICE Candidate:", e);
                        }
                    }
                });

                socket.emit('join-room', { roomId });

            } catch (err) {
                console.error("❌ Maka fatal no WebRTC:", err);
            }
        };

        init();

        return () => {
            console.log("🔌 Encerrando sessão de Live...");
            socket.disconnect();
            if (pc.current) {
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