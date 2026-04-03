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

        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('plan', plan);
        formData.append('amount', amount.toString());
        formData.append('cycle', cycle);

        try {
            const { data } = await paymentService.submitPayment(formData);
            setHistory(prev => [data, ...prev]);
            return data;
        } catch (error) {
            console.error("Erro na API de pagamento:", error);
            throw new Error("Falha ao enviar comprovativo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const { data } = await paymentService.getHistory(userId);
            setHistory(data);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        }
    };

    return { submitReceipt, fetchHistory, history, isSubmitting };
};