// hooks/usePayment.ts
import { useState } from 'react';
import { paymentService } from '@/services/api';
import { PaymentRecord, PaymentPlan } from '@/types/payment';


interface ApiError {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
    message: string;
}

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

        // --- 1. SANEAMENTO DO PLANO ---
        let cleanPlan = String(plan).toUpperCase();
        if (cleanPlan.includes('PREMIUM')) cleanPlan = 'PREMIUM';
        if (cleanPlan.includes('ENTERPRISE')) cleanPlan = 'ENTERPRISE';

        // --- 2. MONTAGEM DO FORMDATA ---
        formData.append('userId', userId);
        formData.append('plan', cleanPlan);
        formData.append('cycle', cycle.toLowerCase());
        formData.append('file', file);

        try {
            const { data } = await paymentService.submitPayment(formData);
            setHistory(prev => [data, ...prev]);
            return data;
        } catch (err: unknown) {

            const error = err as ApiError;


            const backendMessage = error.response?.data?.message;


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