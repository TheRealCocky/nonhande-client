import { Shield, Lock, Mic, Database, UserCheck, HardDrive } from "lucide-react";
import {BackButton} from "@/components/shared/BackButton";

export default function PrivacyPage() {
    return (

        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <BackButton></BackButton>
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Política de Privacidade</h1>
                </div>

                <div className="prose prose-invert max-w-none space-y-10 text-foreground/80 leading-relaxed">
                    <p className="text-lg">
                        A presente Política de Privacidade descreve de forma transparente como a <strong>Nonhande</strong> recolhe, processa, protege e utiliza os dados dos seus utilizadores. O nosso compromisso é garantir um ambiente seguro e ético para a aprendizagem autónoma da língua Nhaneka-Humbe.
                    </p>

                    <div className="grid gap-6">
                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <UserCheck className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">1. Dados de Conta e Autenticação</h3>
                            </div>
                            <p className="text-sm">
                                Recolhemos dados essenciais para o funcionamento da conta, incluindo nome, endereço de e-mail e credenciais de acesso (encriptadas de forma irreversível). Caso optes pela autenticação via Google OAuth2, recolhemos apenas as informações públicas autorizadas, como o teu identificador e imagem de perfil, sem qualquer acesso a dados privados da tua conta externa.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Mic className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">2. Processamento de Voz e IA Pedagógica</h3>
                            </div>
                            <p className="text-sm">
                                Para a validação fonética e exercícios de conversação, os trechos de áudio capturados são processados em tempo real através de modelos avançados de transcrição (Speech-to-Text). O teu histórico com os agentes de IA é conservado na tua "Memória", permitindo que o sistema adapte o ritmo das lições. Garantimos que os teus áudios e conversas nunca são comercializados para treino de inteligências artificiais de terceiros ou publicidade.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <HardDrive className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">3. Documentos e Integração Semântica</h3>
                            </div>
                            <p className="text-sm">
                                Ao submeteres ficheiros para análise ou recuperação semântica no sistema, os metadados e o conteúdo são indexados exclusivamente para o teu benefício pedagógico. O utilizador detém controlo absoluto para solicitar a eliminação destes documentos e da extração associada a qualquer momento.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">4. Gamificação e Métricas de Progresso</h3>
                            </div>
                            <p className="text-sm">
                                A plataforma monitoriza o teu progresso letivo, métricas de XP, gestão de vidas (corações) e o estado das atividades para garantir a integridade da gamificação e permitir a emissão de relatórios para gestão docente. Informações sobre subscrições e planos são mantidas estritamente para verificação de acesso e auditorias internas do sistema.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">5. Segurança e Direitos do Utilizador</h3>
                            </div>
                            <p className="text-sm">
                                A arquitetura da Nonhande opera em infraestruturas cloud seguras. Nos termos da legislação aplicável à proteção de dados, deténs o direito à retificação, acesso e ao "direito a ser esquecido", podendo eliminar de forma permanente todo o teu histórico, dados de conversação com a IA e memórias episódicas através das definições da tua conta.
                            </p>
                        </section>
                    </div>

                    <p className="text-xs text-foreground/50 mt-12 text-center uppercase tracking-widest">
                        Última atualização: {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}