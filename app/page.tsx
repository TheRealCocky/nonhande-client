"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Gamepad2,
  User,
  Radio,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Trophy,
  Video,
  Zap,
  Bot,
  Search,
  Landmark,
  Building2,
  Globe,
  Languages,
  BarChart3
} from "lucide-react";

import Footer from "@/components/shared/footer";
import MobileNav from "@/components/shared/MobileNav";

interface FeatureCardProps { icon: React.ReactNode; title: string; desc: string; badge?: string; }
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const phrases = useMemo(() => ["Bem-vindo ao", "Lyepe-ko", "Lyepei-ko", "Lyepe unene"], []);

  const showAnalytics = isLoggedIn && (userRole === 'ADMIN' || userRole === 'TEACHER');

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("nonhande_token");
    const role = localStorage.getItem('user_role');

    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const token = localStorage.getItem("nonhande_token");
      if (token) setIsLoggedIn(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleTyping = () => {
      const current = loopNum % phrases.length;
      const fullText = phrases[current];
      setText(prev => isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1));
      setTypingSpeed(isDeleting ? 70 : 150);
      if (!isDeleting && text === fullText) { setTimeout(() => setIsDeleting(true), 2000); }
      else if (isDeleting && text === "") { setIsDeleting(false); setLoopNum(loopNum + 1); }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases, mounted]);

  const logoUrl = "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png";
  const avatarUrl = "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766508699/sitdown_h8przw.webp";

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem("nonhande_token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (!mounted) return null;

  return (
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500 isolation-isolate">

        <nav className="fixed top-0 left-0 w-full h-20 border-b border-platinum/20 bg-background/80 backdrop-blur-md z-[100] px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logoUrl} alt="Logo Nonhande" height={36} width={150} priority style={{ height: '36px', width: 'auto' }} />
            <span className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase">Nonhande</span>
          </div>
          <ul className="hidden md:flex gap-8 items-center font-bold text-sm text-text-secondary">
            <NavItem icon={<Home size={18} />} label="Início" active />
            <Link href="/dicionary/feed"><NavItem icon={<BookOpen size={18} />} label="Dicionário" /></Link>
            <Link href="/realgamification/map"><NavItem icon={<Gamepad2 size={18} />} label="Jogos" /></Link>
            <Link href="/live"><NavItem icon={<Radio size={18} className="text-red-500 animate-pulse" />} label="Live" /></Link>
            <Link href="/chat"><NavItem icon={<Sparkles size={18} className="text-gold" />} label="Nonhande IA" /></Link>
            <Link href="/ranking"><NavItem icon={<Trophy  size={20} strokeWidth={2.5} />} label="Ranking" /></Link>
          </ul>

          {/* ✨ RENDERIZAÇÃO CONDICIONAL PARA O ANALYTICS */}
          {showAnalytics && (
              <Link href="/analytics">
                <NavItem
                    icon={<BarChart3 size={18} className="text-blue-500" />}
                    label="Monitorização"
                />
              </Link>
          )}

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleTheme} className="p-2 md:p-2.5 rounded-xl bg-platinum/50 border border-platinum transition-all hover:bg-platinum">
              {isDarkMode ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            {!isLoggedIn ? (
                <Link href="/auth/signin" className="bg-gold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-gold/20">Entrar</Link>
            ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full border-2 border-gold overflow-hidden bg-platinum flex items-center justify-center">
                    <Link href="/profile"> <User size={20} className="text-gold" /></Link>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={20} /></button>
                </div>
            )}
          </div>
        </nav>

        <main className="flex-grow">
          <section className="relative pt-24 md:pt-32 pb-16 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
                    <Sparkles size={14} className="text-gold" />
                    <span>Plataforma Platinada</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] mb-6 min-h-[120px] md:min-h-[130px] lg:min-h-[160px]">
                    <span className="text-foreground">{text}</span><br />
                    <span className="text-gold uppercase tracking-tighter">Nonhande.</span>
                    <span className="animate-pulse text-gold ml-1">|</span>
                  </h1>
                  <p className="text-text-secondary text-base md:text-lg lg:text-xl mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
                    Aprenda Nhaneca-Humbe <span className="line-through decoration-gold/50 decoration-2 opacity-60 italic"> e outras línguas nacionais</span> com a tecnologia que Angola merece.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button className="bg-gold text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-black text-base lg:text-lg shadow-2xl shadow-gold/30 hover:-translate-y-1 transition-transform"><Link href="/realgamification/map">ESTUDAR AGORA</Link></button>

                  </div>
                </div>
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full max-h-[400px] lg:max-h-none bg-platinum/20 rounded-[40px] border border-platinum flex items-center justify-center p-6 lg:p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent opacity-50" />
                    <div className="absolute top-6 left-2 md:top-8 md:left-4 lg:top-12 lg:left-8 bg-background p-3 lg:p-5 rounded-2xl shadow-2xl border border-platinum w-40 md:w-44 lg:w-56 transform -rotate-3 z-20 cursor-pointer transition-all hover:rotate-0 hover:scale-110 group">
                      <span className="text-[8px] lg:text-[10px] font-black text-gold uppercase tracking-widest">Palavra do Dia</span>
                      <h4 className="text-lg lg:text-2xl font-black mt-1">Otyipuka</h4>
                      <p className="text-[10px] lg:text-sm text-text-secondary italic">&quot;Coisa&quot; em Nhaneca</p>
                      <div className="mt-3 h-1 w-8 lg:w-10 bg-gold rounded-full transition-all group-hover:w-20" />
                    </div>
                    <div className="absolute bottom-6 right-2 md:bottom-8 md:right-4 lg:bottom-12 lg:right-8 bg-background p-3 lg:p-5 rounded-2xl shadow-2xl border border-platinum w-44 md:w-48 lg:w-64 transform rotate-2 z-20 flex items-center gap-3 lg:gap-4 cursor-pointer transition-all hover:rotate-0 hover:scale-110 group">
                      <div className="bg-red-500/10 p-2 lg:p-3 rounded-xl text-red-500 animate-pulse group-hover:bg-red-500 group-hover:text-white"><Radio size={20} className="lg:w-6 lg:h-6" /></div>
                      <div>
                        <p className="text-[8px] lg:text-[10px] font-black text-red-500 uppercase">Live Agora</p>
                        <p className="font-bold text-[10px] lg:text-sm">Aula de Fonética</p>
                      </div>
                    </div>
                    <div className="animate-float">
                      <Languages size={120} className="text-gold/10 rotate-12 lg:w-[150px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 border-t border-platinum bg-platinum/5">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">O Arsenal <span className="text-gold">Tecnológico</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                    icon={<Bot className="text-gold" size={28} />}
                    title="Nonhande IA"
                    desc="O teu copiloto inteligente com motores especializados em turismo, história e análise de documentos. Comunica por voz em tempo real e utiliza memória semântica para personalizar cada conversa."
                    badge="Advanced AI"
                />
                <FeatureCard
                    icon={<Video className="text-red-500" size={28} />}
                    title="Live Classes"
                    desc="Sessões em tempo real com mestres da língua. O Lubango a um clique de distância."
                    badge="Live Stream"
                />
                <FeatureCard
                    icon={<Gamepad2 className="text-gold" size={28} />}
                    title="Gamificação"
                    desc="Transformamos o estudo em conquista. Ganha XP e desbloqueia segredos ancestrais."
                />
                <FeatureCard
                    icon={<Zap className="text-gold" size={28} />}
                    title="Progressão"
                    desc="Sistema de sobrevivência e save-points. O teu progresso é sagrado."
                    badge="Real-time"
                />
                <FeatureCard
                    icon={<Trophy className="text-gold" size={28} />}
                    title="Ranking Elite"
                    desc="Disputa o topo com os melhores alunos de Angola e do mundo."
                />
                <FeatureCard
                    icon={<Search className="text-gold" size={28} />}
                    title="Dicionário Digital"
                    desc="Dicionário inteligente com busca instantânea de gírias e expressões regionais."
                    badge="Premium"
                />
              </div>
            </div>
          </section>


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

          <section className="py-24 bg-background border-t border-platinum/10">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Visão <span className="text-gold">Estratégica</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <RoadmapItem icon={<Landmark size={24}/>} title="Banca Local" desc="APIs para ATMs e suporte bancário nativo em línguas nacionais." />
                <RoadmapItem icon={<Building2 size={24}/>} title="Serviços Públicos" desc="Inclusão digital governamental para todos os cidadãos angolanos." />
                <RoadmapItem icon={<Globe size={24}/>} title="Turismo 4.0" desc="Guias inteligentes e tradução em tempo real para o setor hoteleiro." />
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <MobileNav />
      </div>
  );
}

function FeatureCard({ icon, title, desc, badge }: FeatureCardProps) {
  return (
      <div className="relative p-8 rounded-[32px] border border-platinum hover:border-gold/50 transition-all duration-500 bg-card-custom/40 backdrop-blur-sm group hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/10 overflow-hidden cursor-default">
        {badge && (
            <div className="absolute top-4 right-4 bg-gold/10 text-gold text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-gold/20">
              {badge}
            </div>
        )}
        <div className="mb-6 w-14 h-14 flex items-center justify-center bg-background rounded-2xl border border-platinum shadow-xl group-hover:scale-110 group-hover:bg-gold/5 transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-xl font-black mb-3 uppercase tracking-tighter">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed font-medium">{desc}</p>
        <div className="mt-6 h-1 w-0 bg-gold rounded-full transition-all duration-700 group-hover:w-full opacity-50" />
      </div>
  );
}

function RoadmapItem({ icon, title, desc }: RoadmapProps) {
  return (
      <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[32px] border border-platinum/50 hover:bg-platinum/20 transition-all duration-500 group">
        <div className="text-gold w-16 h-16 flex items-center justify-center bg-background rounded-2xl shadow-lg border border-platinum/30 group-hover:rotate-[360deg] transition-transform duration-1000">{icon}</div>
        <div>
          <h4 className="font-black text-sm uppercase mb-2 tracking-tighter">{title}</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-bold">{desc}</p>
        </div>
      </div>
  );
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
      <li className={`flex items-center gap-2 cursor-pointer transition-colors ${active ? 'text-gold' : 'text-text-secondary hover:text-gold'}`}>
        {icon} <span className="text-sm font-bold">{label}</span>
      </li>
  );
}
