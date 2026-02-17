'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const PlayLoading = () => {
    return (
        /* Sem fundo, apenas z-index alto e centralizado */
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-gold/20 flex flex-col items-center pointer-events-auto"
            >
                <Loader2 className="animate-spin text-gold" size={32} strokeWidth={3} />
                <span className="mt-3 text-[8px] font-black uppercase tracking-[0.3em] text-gold/80">
                    A carregar...
                </span>
            </motion.div>
        </div>
    );
};