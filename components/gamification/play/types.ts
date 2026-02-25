import { Activity } from '@/types/gamification';

export type ChallengeResponse = {
    // Agora tipado corretamente: string (MultipleChoice/WordBank),
    // boolean (Pairs), ou unknown para flexibilidade total sem perder segurança.
    userAnswer: string | string[] | boolean | unknown;
    isValid: boolean; // Se o botão "Verificar" deve ser desbloqueado
};

export interface ChallengeProps {
    // Usamos a interface real da Atividade vinda do teu backend/prisma
    activity: Activity;
    isAnswered: boolean;
    onSetAnswer: (response: ChallengeResponse) => void;
}