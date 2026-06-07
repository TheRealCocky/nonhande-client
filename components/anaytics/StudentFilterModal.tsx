import { useState } from 'react';
import { X, Search, Check, Users } from 'lucide-react';
import { StudentReport } from '@/types/analytics';
interface Props {
    isOpen: boolean;
    onClose: () => void;
    students:  StudentReport[];
    selectedIds: string[];
    onApply: (ids: string[]) => void;
}

export default function StudentFilterModal({ isOpen, onClose, students, selectedIds, onApply }: Props) {
    const [search, setSearch] = useState('');
    const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

    if (!isOpen) return null;

    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    
    const toggleStudent = (id: string) => {
        setTempSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setTempSelected(tempSelected.length === students.length ? [] : students.map(s => s.id));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-platinum flex justify-between items-center">
                    <h3 className="font-black text-lg text-text-primary uppercase tracking-tighter flex items-center gap-2">
                        <Users size={20} className="text-gold" /> Filtrar Estudantes
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-platinum rounded-full"><X size={20} /></button>
                </div>

                {/* Busca */}
                <div className="p-4 border-b border-platinum">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-platinum" size={16} />
                        <input 
                            className="w-full bg-platinum/30 p-3 pl-10 rounded-xl outline-none focus:ring-2 ring-gold text-xs font-bold"
                            placeholder="Pesquisar nome do estudante..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Lista */}
                <div className="max-h-[400px] overflow-y-auto">
                    <button onClick={toggleAll} className="w-full flex items-center gap-3 p-4 hover:bg-gold/5 transition-colors border-b border-platinum">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${tempSelected.length === students.length ? 'bg-gold border-gold' : 'border-platinum'}`}>
                            {tempSelected.length === students.length && <Check size={12} color="white" />}
                        </div>
                        <span className="text-xs font-black uppercase text-text-primary">Selecionar Todos ({students.length})</span>
                    </button>
                    {filtered.map(s => (
                        <button key={s.id} onClick={() => toggleStudent(s.id)} className="w-full flex items-center gap-3 p-4 hover:bg-platinum/20 transition-colors">
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${tempSelected.includes(s.id) ? 'bg-gold border-gold' : 'border-platinum'}`}>
                                {tempSelected.includes(s.id) && <Check size={12} color="white" />}
                            </div>
                            <span className="text-xs font-bold text-text-secondary">{s.name}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-platinum/10">
                    <button 
                        onClick={() => { onApply(tempSelected); onClose(); }}
                        className="w-full bg-gold text-white py-3 rounded-xl font-black text-[11px] uppercase hover:scale-[1.02] transition-transform"
                    >
                        Aplicar Filtro ({tempSelected.length})
                    </button>
                </div>
            </div>
        </div>
    );
}