export type ChallengeResponse = {
    userAnswer: any; // O valor da resposta (string, array de strings, ou boolean)
    isValid: boolean; // Se o botão "Verificar" deve ser desbloqueado
};

export interface ChallengeProps {
    activity: any;
    isAnswered: boolean;
    onSetAnswer: (response: ChallengeResponse) => void;
}