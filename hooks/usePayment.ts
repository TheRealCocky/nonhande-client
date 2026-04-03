// hooks/usePayment.ts
import { useState } from 'react';
import { paymentService } from '@/services/api';
import { PaymentRecord, PaymentPlan } from '@/types/payment';

export const usePayment = (userId: string) => {
    const [history, setHistory] = useState<PaymentRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitReceipt = async (
        file: File,
        plan: PaymentPlan,
        amount: number,
        cycle: string = 'monthly'
    ) => {
        setIsSubmitting(true);
        const formData = new FormData();

        // --- 1. SANEAMENTO DO PLANO (RESOLVE O ERRO "E") ---
        // Se o plano for 'PREMIUM_MONTHLY', isto garante que enviamos 'PREMIUM'
        // Se já for 'PREMIUM', continua 'PREMIUM'
        let cleanPlan = String(plan).toUpperCase();
        if (cleanPlan.includes('PREMIUM')) cleanPlan = 'PREMIUM';
        if (cleanPlan.includes('ENTERPRISE')) cleanPlan = 'ENTERPRISE';

        // --- 2. MONTAGEM DO FORMDATA (ORDEM SEGURA) ---
        formData.append('userId', userId);
        formData.append('plan', cleanPlan);
        formData.append('cycle', cycle.toLowerCase());

        // NOTA: 'amount' foi removido porque o teu DTO no backend não o aceita

        formData.append('file', file); // O ficheiro sempre no fim

        try {
            const { data } = await paymentService.submitPayment(formData);
            setHistory(prev => [data, ...prev]);
            return data;
        } catch (error: any) {
            // Se o backend responder com erro, extraímos a mensagem real
            const backendMessage = error.response?.data?.message;

            // Se for um array (validação), pegamos o primeiro erro, senão a string
            const finalError = Array.isArray(backendMessage)
                ? backendMessage[0]
                : backendMessage;

            console.error("ERRO DETALHADO DO SERVIDOR:", finalError || error.message);

            throw new Error(finalError || "Falha ao enviar comprovativo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitReceipt, isSubmitting, history };
};