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

// --- INTERFACES DE TIPAGEM ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface RoadmapProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Estado para verificar login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const phrases = useMemo(() => ["Bem-vindo ao", "Lyepe-ko", "Lyepei-ko", "Lyepe unene"], []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleTyping = () => {
      const current = loopNum % phrases.length;
      const fullText = phrases[current];

      setText(
          isDeleting
              ? fullText.substring(0, text.length - 1)
              : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 70 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  const logoUrl = "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png";
  const avatarUrl = "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp";

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  // Evita erro de Hydration no Next.js
  if (!mounted) return null;

  return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-24 md:pb-0 md:pt-20">

        {/* ================= HEADER ================= */}
        <nav className="fixed top-0 left-0 w-full h-20 border-b border-platinum bg-background/80 backdrop-blur-md z-50 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logoUrl} alt="Logo Nonhande" height={36} width={150} priority style={{ height: '36px', width: 'auto' }} />
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

            {/* BOTÃO DINÂMICO DE LOGIN / PERFIL */}
            {!isLoggedIn ? (
                <Link href="/auth/signin" className="bg-gold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95">
                  Entrar
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full border-2 border-gold overflow-hidden bg-platinum flex items-center justify-center">
                    <User size={20} className="text-gold" />
                  </div>
                  <button
                      onClick={handleLogout}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sair"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
            )}
          </div>
        </nav>

        {/* ================= HERO SESSION ================= */}
        <section className="relative pt-24 md:pt-32 pb-16 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
                  <Sparkles size={14} className="text-gold" />
                  <span>Plataforma Platinada</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-black leading-[1.1] mb-6 min-h-[120px] md:min-h-[160px]">
                  <span className="text-foreground">{text}</span>
                  <br />
                  <span className="text-gold uppercase tracking-tighter">Nonhande.</span>
                  <span className="animate-pulse text-gold ml-1">|</span>
                </h1>

                <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
                  Aprenda Nhaneca-Humbe <span className="line-through decoration-gold/50 decoration-2 opacity-60 italic"> e outras línguas nacionais</span> com a tecnologia que Angola merece.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gold text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-gold/30 hover:-translate-y-1 transition-transform">
                    ESTUDAR AGORA
                  </button>
                  <button className="bg-background border-2 border-platinum text-foreground px-10 py-5 rounded-2xl font-bold text-lg hover:bg-platinum/20 transition-colors">
                    Ver Demos
                  </button>
                </div>
              </div>

              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="relative w-full h-full bg-platinum/20 rounded-[40px] border border-platinum flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent opacity-50" />

                  <div className="absolute top-8 left-4 md:top-12 md:left-8 bg-background p-5 rounded-2xl shadow-2xl border border-platinum w-48 md:w-56 transform -rotate-3 z-20 cursor-pointer transition-all duration-500 ease-out hover:rotate-0 hover:scale-110 hover:shadow-gold/20 group">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">Palavra do Dia</span>
                    <h4 className="text-2xl font-black mt-1">Otyipuka</h4>
                    <p className="text-sm text-text-secondary italic">&quot;Coisa&quot; em Nhaneca</p>
                    <div className="mt-3 h-1 w-10 bg-bronze rounded-full transition-all group-hover:w-20" />
                  </div>

                  <div className="absolute bottom-8 right-4 md:bottom-12 md:right-8 bg-background p-5 rounded-2xl shadow-2xl border border-platinum w-52 md:w-64 transform rotate-2 z-20 flex items-center gap-4 cursor-pointer transition-all duration-500 ease-out hover:rotate-0 hover:scale-110 hover:shadow-red-500/20 group">
                    <div className="bg-red-500/10 p-3 rounded-xl text-red-500 animate-pulse group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Radio size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-500 uppercase">Live Agora</p>
                      <p className="font-bold text-sm">Aula de Fonética</p>
                    </div>
                  </div>

                  <Languages size={150} className="text-gold/10 rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= QUEM SOMOS ================= */}
        <section className="py-20 bg-card-custom/50">
          <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gold/10 blur-2xl rounded-full" />
                <Image src={avatarUrl} alt="Avatar Nonhande" width={400} height={400} className="relative w-full max-w-sm h-auto drop-shadow-2xl" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
                Feito por Angolanos, <br /><span className="text-gold">Para o Mundo</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                O Nonhande não é apenas uma aplicação. É um compromisso com a nossa identidade.
                Utilizamos áudios reais gravados por anciãos e especialistas para garantir que a
                essência da nossa língua chegue até si de forma pura.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-2xl border border-platinum">
                  <p className="text-gold font-black text-2xl">100%</p>
                  <p className="text-xs uppercase font-bold text-text-secondary">Áudio Real</p>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-platinum">
                  <p className="text-gold font-black text-2xl">MVP</p>
                  <p className="text-xs uppercase font-bold text-text-secondary">Fase Ativa</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="py-24 border-t border-platinum">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <h2 className="text-center text-3xl md:text-5xl font-black mb-16 uppercase">Funcionalidades <span className="text-gold">Chave</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={<BookOpen className="text-gold" />} title="Dicionário Digital" desc="Milhares de palavras com tradução direta e fonética para facilitar a escrita." />
              <FeatureCard icon={<Volume2 className="text-gold" />} title="Laboratório de Áudio" desc="Repita e compare sua voz com as gravações reais armazenadas no nosso dataset." />
              <FeatureCard icon={<Gamepad2 className="text-gold" />} title="Prática Gamificada" desc="Desafios de Bronze, Prata e Ouro para testar o seu conhecimento diário." />
            </div>
          </div>
        </section>

        {/* ================= FUTURO ================= */}
        <section className="py-24 bg-background overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase">O Futuro da <span className="text-gold">Plataforma</span></h2>
              <p className="text-text-secondary mt-4">Nossa visão para escalar as línguas nacionais angolanas.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <RoadmapItem icon={<Mic size={24}/>} title="Reconhecimento (Whisper)" desc="Sistema de IA para avaliar se a sua pronúncia está correta em tempo real." />
              <RoadmapItem icon={<Brain size={24}/>} title="Chatbot LlamaIndex" desc="Um tutor cultural que explica o significado profundo de cada expressão." />
              <RoadmapItem icon={<Sparkles size={24}/>} title="Escala com Coqui TTS" desc="Geração de áudio automático para frases longas e novas lições." />
            </div>
          </div>
        </section>

        {/* MOBILE NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-platinum z-50 flex justify-around py-3">
          <MobileNavItem icon={<Home size={22} />} label="Home" active />
          <MobileNavItem icon={<BookOpen size={22} />} label="Dicionário" />
          <MobileNavItem icon={<Gamepad2 size={22} />} label="Jogos" />
          <MobileNavItem icon={<Radio size={22} className="text-red-500 animate-pulse"  />} label="Live" />
          <MobileNavItem icon={<User size={22} />} label="Eu" />
        </nav>
      </main>
  );
}

// --- COMPONENTES AUXILIARES ---
function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
      <div className="p-8 rounded-[32px] border border-platinum hover:border-gold/30 transition-all bg-card-custom/30 group">
        <div className="mb-6 w-12 h-12 flex items-center justify-center bg-background rounded-xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-black mb-3">{title}</h3>
        <p className="text-sm text-text-secondary">{desc}</p>
      </div>
  );
}

function RoadmapItem({ icon, title, desc }: RoadmapProps) {
  return (
      <div className="flex gap-4 p-6 rounded-2xl border border-platinum/50 hover:bg-platinum/10 transition-colors">
        <div className="text-gold shrink-0">{icon}</div>
        <div>
          <h4 className="font-bold mb-1">{title}</h4>
          <p className="text-xs text-text-secondary">{desc}</p>
        </div>
      </div>
  );
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
      <li className={`flex items-center gap-2 cursor-pointer ${active ? 'text-gold' : 'text-text-secondary hover:text-gold'}`}>
        {icon} <span className="text-sm font-bold">{label}</span>
      </li>
  );
}

function MobileNavItem({ icon, label, active = false }: NavItemProps) {
  return (
      <li className={`flex flex-col items-center gap-1 ${active ? 'text-gold' : 'text-text-secondary'}`}>
        {icon} <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
      </li>
  );
}
