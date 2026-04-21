export interface StudentReport {
    id: string;
    name: string;
    xp: number;
    streak: number;
    successRate: number;
    wordsMastered: number;
    aiInteractions: number;
}

export interface ClassGlobalStats {
    totalStudents: number;
    averageXp: number;
    mostDifficultLesson: string;
    topStudents: StudentReport[];
}