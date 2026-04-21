"use client";

import { ReactNode, useState } from 'react';
import { useClassAnalytics, useStudentAnalytics } from '@/hooks/useAnalytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Cell
} from 'recharts';
import { Trophy, BrainCircuit, Target, Download, Flame, BookOpen, Crown } from 'lucide-react';

// Tipagem para as Props do Card
interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color?: string;
}

export default function AnalyticsPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { data: globalData, isLoading: globalLoading } = useClassAnalytics();
    const { data: studentData } = useStudentAnalytics(selectedId);

    const handleDownload = () => window.print();

    if (globalLoading) return <div className="flex justify-center p-20 font-bold text-gold animate-pulse">Carregando métricas do Nonhande...</div>;

    const isFiltered = !!selectedId && !!studentData;

    // Stats dinâmicos para os Cards
    const stats = isFiltered && studentData ? studentData : {
        xp: globalData?.averageXp || 0,
        successRate: globalData ? (globalData.topStudents.reduce((acc, s) => acc + s.successRate, 0) / globalData.totalStudents) : 0,
        aiInteractions: globalData?.topStudents.reduce((acc, s) => acc + s.aiInteractions, 0) || 0,
        streak: 0,
        wordsMastered: globalData?.topStudents.reduce((acc, s) => acc + s.wordsMastered, 0) || 0
    };

    const barData = globalData?.topStudents || [];

    return (
        <div className="p-8 mt-20 max-w-7xl mx-auto print:mt-0 print:p-0">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gold uppercase tracking-tighter flex items-center gap-3">
                        <Crown size={32} />
                        {isFiltered && studentData ? studentData.name : "Análise Global"}
                    </h1>
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-[0.2em] no-print">
                        Painel de Monitorização Pedagógica — Grupo de Teste
                    </p>
                </div>

                <div className="flex items-center gap-3 no-print">
                    <button onClick={handleDownload} className="flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-gold/20 hover:scale-105 transition-all">
                        <Download size={18} /> Exportar Relatório
                    </button>

                    <select
                        className="bg-white border-2 border-platinum p-3 rounded-2xl text-[11px] font-black outline-none focus:border-gold shadow-sm cursor-pointer px-8"
                        onChange={(e) => setSelectedId(e.target.value || null)}
                        value={selectedId || ""}
                    >
                        <option value="">TODOS OS ESTUDANTES</option>
                        {globalData?.topStudents.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            {/* 1. CARTÕES */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 print:grid-cols-5">
                <StatCard title="XP Acumulado" value={stats.xp.toFixed(0)} icon={<Trophy className="text-gold" />} />
                <StatCard title="Ofensiva (Streak)" value={isFiltered ? `${stats.streak} dias` : "--"} icon={<Flame className={isFiltered ? "text-orange-500" : "text-platinum"} />} color={isFiltered ? "border-orange-200" : ""} />
                <StatCard title="Taxa de Acerto" value={`${stats.successRate.toFixed(1)}%`} icon={<Target className="text-red-500" />} />
                <StatCard title="Consultas IA" value={stats.aiInteractions} icon={<BrainCircuit className="text-purple-500" />} />
                <StatCard title="Vocabulário" value={stats.wordsMastered} icon={<BookOpen className="text-blue-500" />} />
            </div>

            {/* 2. ÁREA DE GRÁFICOS REATIVOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">

                <div className="bg-white p-8 rounded-[2rem] border border-platinum shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gold opacity-10"></div>
                    <h2 className="text-xl font-black mb-6 text-text-primary uppercase tracking-tight">
                        {isFiltered ? "Desempenho Individual" : "Ranking de Engajamento"}
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={isFiltered && studentData ? [studentData] : barData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} fontSize={10} domain={[0, 'auto']} />
                                <Tooltip
                                    cursor={{fill: '#fff9e6'}}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="xp" radius={[8, 8, 0, 0]} barSize={isFiltered ? 120 : 40}>
                                    {/* Removido o 'any' e usado o underscore para indicar variável não usada */}
                                    {(isFiltered && studentData ? [studentData] : barData).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill="#D4AF37" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-platinum shadow-sm">
                    <h2 className="text-xl font-black mb-6 text-text-primary uppercase tracking-tight">
                        {isFiltered ? "Métricas de Retenção" : "IA vs Eficiência"}
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={isFiltered && studentData ? [studentData] : barData}
                                margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={10} fontWeight="black" />
                                <YAxis fontSize={10} domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="successRate"
                                    stroke="#10B981"
                                    strokeWidth={4}
                                    dot={{ r: 8, fill: '#10B981', strokeWidth: 3, stroke: '#fff' }}
                                    name="Acerto %"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="aiInteractions"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    strokeDasharray="8 5"
                                    dot={{ r: 6, fill: '#8B5CF6' }}
                                    name="Uso IA"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="hidden print:block mt-20 border-t-2 border-platinum pt-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">Relatório Pedagógico Nonhande</p>
                <p className="text-[10px] text-text-secondary mt-1">Gerado em {new Date().toLocaleDateString('pt-AO')}</p>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <div className={`bg-white p-6 rounded-3xl border-2 ${color || 'border-platinum'} shadow-sm transition-all hover:shadow-md`}>
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">{title}</span>
                <div className="no-print">{icon}</div>
            </div>
            <div className="text-3xl font-black text-text-primary tracking-tighter">{value}</div>
        </div>
    );
}