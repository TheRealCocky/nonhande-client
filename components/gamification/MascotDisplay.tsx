'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

export type MascotMood = 'HAPPY' | 'SAD' | 'THINKING' | 'WAITING' | 'THEORY' | 'IDLE';

interface MascotDisplayProps {
    mood: MascotMood;
    className?: string;
}

const MOOD_IMAGES: Record<MascotMood, string> = {
    HAPPY: 'https://res.cloudinary.com/dwp3wuum6/video/upload/v1770823780/_users_ca602ee1-8d42-4b89-b8fe-6e8ad88991ff_generated_2180e6d2-8ba6-4260-9246-ef8ab2d82ca4_generated_video_rvgdfo.mov',
    SAD: 'https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp', // Exemplo
    THINKING: 'https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp',
    WAITING: 'https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp', // Exemplo
    THEORY: 'https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp',  // Exemplo
    IDLE: 'https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp',   // Exemplo
};

export default function MascotDisplay({ mood, className = "w-40 h-40" }: MascotDisplayProps) {
    const currentSrc = MOOD_IMAGES[mood];

    // ✅ Verifica se o ficheiro é um vídeo (mov, mp4, webm)
    const isVideo = currentSrc.match(/\.(mov|mp4|webm)($|\?)/i);

    const variants: Variants = {
        initial: { opacity: 0, y: 20, scale: 0.8 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 }
        },
        floating: {
            y: [0, -10, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={mood}
                    variants={variants}
                    initial="initial"
                    animate={mood === 'IDLE' || mood === 'WAITING' ? ["animate", "floating"] : "animate"}
                    exit="exit"
                    className="relative w-full h-full flex items-center justify-center"
                >
                    {isVideo ? (
                        <video
                            src={currentSrc}
                            autoPlay
                            playsInline
                            muted // Obrigatório para o autoplay funcionar em browsers mobile/modernos
                            className="w-full h-full object-contain"
                            onEnded={() => {/* Opcional: fazer algo quando o vídeo de 3s acabar */}}
                        />
                    ) : (
                        <Image
                            src={currentSrc}
                            alt={`Mascote Nonhande - Estado ${mood}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}