import { useState, useRef, useCallback } from 'react';

export interface UseVoiceReturn {
    speak: (text: string) => void;
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob>;
}

export const useVoice = (): UseVoiceReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Erro microfone:', err);
        }
    }, []);

    const stopRecording = useCallback((): Promise<Blob> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) {
                resolve(new Blob());
                return;
            }
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                setIsRecording(false);
                mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current = null;
                resolve(audioBlob);
            };
            mediaRecorderRef.current.stop();
        });
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-PT';
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    // ✨ ALTERAÇÃO AQUI: Ordem igual à interface + Casting de segurança
    return {
        speak,
        isRecording,
        startRecording,
        stopRecording
    } as UseVoiceReturn;
};