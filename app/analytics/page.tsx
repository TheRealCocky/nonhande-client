"use client";

import { ReactNode, useState, useMemo } from "react";
import { useClassAnalytics } from "@/hooks/useAnalytics"; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from "recharts";
import {
  Trophy, BrainCircuit, Target, Download, Flame, BookOpen, Crown, Users, ArrowLeft
} from "lucide-react";
import StudentFilterModal from "@/components/anaytics/StudentFilterModal";
import { BackButton } from "@/components/shared/BackButton";

// --- COMPONENTES AUXILIARES ---

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-3xl border border-platinum shadow-sm animate-pulse">
    <div className="h-3 w-20 bg-platinum/30 rounded mb-4" />
    <div className="h-8 w-24 bg-platinum/30 rounded" />
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-3xl border-2 ${color || "border-platinum"} shadow-sm`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">{title}</span>
        <div className="no-print">{icon}</div>
      </div>
      <div className="text-3xl font-black text-text-primary tracking-tighter">{value}</div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---

export default function AnalyticsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
  const { data: globalData, isLoading: globalLoading } = useClassAnalytics(selectedGroupId || undefined);

  // Lógica de dados derivados (AQUI ESTÁ O SEGREDO)
  const filteredData = selectedStudentIds.length > 0 
    ? (globalData?.topStudents || []).filter(s => selectedStudentIds.includes(s.id))
    : (globalData?.topStudents || []);

  const isFiltered = selectedStudentIds.length > 0;

  // Cálculo de estatísticas baseado no array filtrado
  const totalStudents = filteredData.length || 1;
  // Substitui a tua const stats atual por esta:
const stats = useMemo(() => {
  const total = filteredData.length || 1;
  return {
    xp: filteredData.reduce((acc, s) => acc + (s.xp || 0), 0) / total,
    successRate: filteredData.reduce((acc, s) => acc + (s.successRate || 0), 0) / total,
    aiInteractions: filteredData.reduce((acc, s) => acc + (s.aiInteractions || 0), 0),
    streak: 0, 
    wordsMastered: filteredData.reduce((acc, s) => acc + (s.wordsMastered || 0), 0),
  };
}, [filteredData]);

  const handleDownload = () => window.print();

  return (
    <div className="p-8 mt-20 max-w-7xl mx-auto print:mt-0 print:p-0">
       <BackButton></BackButton>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gold uppercase tracking-tighter flex items-center gap-3">
            <Crown size={32} />
            {isFiltered ? `${filteredData.length} ESTUDANTE(S) SELECIONADOS` : "ANÁLISE GLOBAL"}
          </h1>
          <p className="text-xs text-text-secondary font-bold uppercase tracking-[0.2em] no-print">
            {isFiltered ? "Monitorização Personalizada" : "Painel de Monitorização Pedagógica — Grupo de Teste"}
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          {isFiltered && (
            <button 
              onClick={() => setSelectedStudentIds([])} 
              className="flex items-center gap-2 bg-platinum/20 text-text-secondary px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-platinum transition-all"
            >
              <ArrowLeft size={14} /> Desfazer
            </button>
          )}

          <button onClick={handleDownload} className="flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-gold/20 hover:scale-105 transition-all">
            <Download size={18} /> Exportar
          </button>

          <button onClick={() => setIsModalOpen(true)} className="bg-white border-2 border-platinum p-3 rounded-2xl text-[11px] font-black outline-none hover:border-gold transition-all shadow-sm flex items-center gap-2">
            <Users size={14} /> 
            {selectedStudentIds.length === 0 ? "FILTRAR ESTUDANTES" : `${selectedStudentIds.length} SELECIONADOS`}
          </button>
        </div>
      </div>

      {/* SKELETONS OU DADOS */}
      {globalLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          <StatCard title="XP Médio" value={stats.xp.toFixed(0)} icon={<Trophy className="text-gold" />} />
          <StatCard title="Streak" value={stats.streak} icon={<Flame className="text-orange-500" />} />
          <StatCard title="Taxa de Acerto" value={`${stats.successRate.toFixed(1)}%`} icon={<Target className="text-red-500" />} />
          <StatCard title="Consultas IA" value={stats.aiInteractions} icon={<BrainCircuit className="text-purple-500" />} />
          <StatCard title="Vocabulário" value={stats.wordsMastered} icon={<BookOpen className="text-blue-500" />} />
        </div>
      )}

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-platinum shadow-sm">
          <h2 className="text-xl font-black mb-6 text-text-primary uppercase tracking-tight">Desempenho (XP)</h2>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#fff9e6'}} />
                <Bar dataKey="xp" radius={[8, 8, 0, 0]} fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-platinum shadow-sm">
          <h2 className="text-xl font-black mb-6 text-text-primary uppercase tracking-tight">Evolução (IA vs Acerto)</h2>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} fontWeight="black" />
                <Tooltip />
                <Line type="monotone" dataKey="successRate" stroke="#10B981" strokeWidth={3} name="Acerto %" />
                <Line type="monotone" dataKey="aiInteractions" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" name="Uso IA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <StudentFilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={globalData?.topStudents || []}
        selectedIds={selectedStudentIds}
        onApply={(ids) => setSelectedStudentIds(ids)}
      />
    </div>
  );
}
