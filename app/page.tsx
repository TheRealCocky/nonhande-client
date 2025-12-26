"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Gamepad2,
  User,
  Volume2,
  Languages,
  Radio,
  Sparkles,
  Sun,
  Moon,
  Mic,
  Brain,
  LogOut
} from "lucide-react";

interface FeatureCardProps { icon: React.ReactNode; title: string; desc: string; }
interface RoadmapProps { icon: React.ReactNode; title: string; desc: string; }
interface NavItemProps { icon: React.ReactNode; label: string; active?: boolean; }

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const phrases = useMemo(() => ["Bem-vindo ao", "Lyepe-ko", "Lyepei-ko", "Lyepe unene"], []);

  // Fix para o ESLint: Marcar montagem apenas uma vez
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // Lógica de animação separada
  useEffect(() => {
    const handleTyping = () => {
      const current = loopNum % phrases.length;
      const fullText = phrases[current];
      setText(prev => isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1));
      setTypingSpeed(isDeleting ? 70 : 150);
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(l => l + 1);
      }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (!mounted) return null;

  return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-24 md:pb-0 md:pt-20">
        <nav className="fixed top-0 left-0 w-full h-20 border-b border-platinum bg-background/80 backdrop-blur-md z-50 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png" alt="Logo" height={36} width={150} priority style={{ height: '36px', width: 'auto' }} />
            <span className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase">Nonhande</span>
          </div>

          <ul className="hidden md:flex gap-8 items-center font-bold text-sm text-text-secondary">
            <NavItem icon={<Home size={18} />} label="Início" active />
            <NavItem icon={<BookOpen size={18} />} label="Dicionário" />
            <NavItem icon={<Gamepad2 size={18} />} label="Jogos" />
            <NavItem icon={<Radio size={18} className="text-red-500 animate-pulse" />} label="Live" />
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleTheme} className="p-2 md:p-2.5 rounded-xl bg-platinum/50 border border-platinum transition-all hover:bg-platinum">
              {isDarkMode ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {!isLoggedIn ? (
                <Link href="/auth/signin" className="bg-gold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95">
                  Entrar
                </Link>
            ) : (
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full border-2 border-gold overflow-hidden bg-platinum flex items-center justify-center">
                    <User size={20} className="text-gold" />
                  </div>
                  <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sair">
                    <LogOut size={20} />
                  </button>
                </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-16 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
                  <Sparkles size={14} className="text-gold" />
                  <span>Plataforma Platinada</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black leading-[1.1] mb-6 min-h-[120px] md:min-h-[160px]">
                  <span className="text-foreground">{text}</span><br />
                  <span className="text-gold uppercase tracking-tighter">Nonhande.</span>
                  <span className="animate-pulse text-gold ml-1">|</span>
                </h1>
                <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-md mx-auto md:mx-0">
                  Aprenda Nhaneca-Humbe com a tecnologia que Angola merece.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gold text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-gold/30 hover:-translate-y-1 transition-transform">
                    ESTUDAR AGORA
                  </button>
                </div>
              </div>
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="relative w-full h-full bg-platinum/20 rounded-[40px] border border-platinum flex items-center justify-center p-8 overflow-hidden">
                  <Languages size={150} className="text-gold/10 rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resto das seções (Quem Somos, Features, Futuro)... omitidas para brevidade, mas devem ser mantidas */}

        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-platinum z-50 flex justify-around py-3">
          <MobileNavItem icon={<Home size={22} />} label="Home" active />
          <MobileNavItem icon={<BookOpen size={22} />} label="Dicionário" />
          <MobileNavItem icon={<Gamepad2 size={22} />} label="Jogos" />
          <MobileNavItem icon={<Radio size={22} className="text-red-500 animate-pulse"  />} label="Live" />
          <MobileNavItem icon={<User size={22} />} label="Eu" active={isLoggedIn} />
        </nav>
      </main>
  );
}

function MobileNavItem({ icon, label, active = false }: NavItemProps) {
  return (
      <li className={`flex flex-col items-center gap-1 ${active ? 'text-gold' : 'text-text-secondary'}`}>
        {icon} <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
      </li>
  );
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
      <li className={`flex items-center gap-2 cursor-pointer ${active ? 'text-gold' : 'text-text-secondary hover:text-gold'}`}>
        {icon} <span className="text-sm font-bold">{label}</span>
      </li>
  );
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
      <div className="p-8 rounded-[32px] border border-platinum hover:border-gold/30 transition-all bg-card-custom/30 group">
        <div className="mb-6 w-12 h-12 flex items-center justify-center bg-background rounded-xl shadow-sm">{icon}</div>
        <h3 className="text-xl font-black mb-3">{title}</h3>
        <p className="text-sm text-text-secondary">{desc}</p>
      </div>
  );
}
