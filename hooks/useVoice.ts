import { useState, useRef, useCallback } from 'react';

export const useVoice = () => {
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
            console.error('Erro ao aceder microfone:', err);
            alert('Não conseguimos aceder ao teu microfone, mestre.');
        }
    }, []);

    const stopRecording = useCallback((): Promise<Blob> => {
        return new Promise((resolve) => {
            // Verificamos se a referência existe
            if (!mediaRecorderRef.current) return;

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                setIsRecording(false);

                // Parar todos os tracks para desligar a luzinha do microfone
                mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

                // Limpar a referência para o próximo uso
                mediaRecorderRef.current = null;
                resolve(audioBlob);
            };

            // MUDANÇA AQUI: Usar a referência com .current
            mediaRecorderRef.current.stop();
        });
    }, []);

    return { isRecording, startRecording, stopRecording };
};