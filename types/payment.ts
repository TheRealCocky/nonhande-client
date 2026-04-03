/**
 * 💳 Tipos para o Sistema de Pagamentos Nonhande
 */

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PaymentPlan = 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_LIFETIME';

export interface PaymentSubmitData {
    userId: string;
    plan: PaymentPlan;
    amount: number;
    receipt: File; // O ficheiro do comprovativo (Talão/PDF)
    reference?: string; // Opcional: Número da transação/IBAN
}

export interface PaymentRecord {
    id: string;
    userId: string;
    plan: PaymentPlan;
    amount: number;
    status: PaymentStatus;
    receiptUrl: string; // URL do Cloudinary/S3 onde guardaste o comprovativo
    createdAt: string;
    updatedAt: string;
    approvedBy?: string; // ID do Admin que aprovou
    rejectionReason?: string; // Caso o pagamento seja negado
}

/**
 * Interface para a Resposta da API ao listar pagamentos
 */
export interface PaymentHistoryResponse {
    payments: PaymentRecord[];
    total: number;
}