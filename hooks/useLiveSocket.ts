'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Interface para tipar os dados de sinalização e evitar o erro de 'any'
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
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);

                const peer = new RTCPeerConnection(ICE_SERVERS);
                pc.current = peer;

                stream.getTracks().forEach(track => peer.addTrack(track, stream));

                peer.ontrack = (event) => {
                    console.log("🎬 Stream remoto detetado!");
                    setRemoteStream(event.streams[0]);
                };

                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', { toRoom: roomId, candidate: event.candidate });
                    }
                };

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

                // CORREÇÃO: Tipagem explícita para o ICE Candidate
                socket.on('ice-candidate', async (data: SignalingData) => {
                    const candidate = data.candidate;
                    if (candidate) {
                        try {
                            await peer.addIceCandidate(new RTCIceCandidate(candidate));
                        } catch (e) {
                            console.error("Erro ao adicionar ICE Candidate", e);
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
    }, [roomId]); // Removi o localStream da dependência para evitar loops infinitos

    return { localStream, remoteStream };
};