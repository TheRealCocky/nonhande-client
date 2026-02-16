// components/gamification/play/UI/Header.tsx
import { X, Heart } from 'lucide-react';

interface HeaderProps {
    progress: number; // 0 a 100
    hearts: number;
    onClose: () => void;
}

export const Header = ({ progress, hearts, onClose }: HeaderProps) => (
    <header className="flex-none p-4 md:p-8 max-w-5xl mx-auto w-full flex items-center gap-4">
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <X size={28} />
        </button>
        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
            <div
                className="h-full bg-gold transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
            <Heart className="text-red-500 fill-red-500" size={18} />
            <span className="font-black text-red-500">{hearts}</span>
        </div>
    </header>
);