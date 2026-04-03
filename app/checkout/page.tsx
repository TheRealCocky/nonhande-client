'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Dados vindos da URL
    const plan = searchParams.get('plan') || 'PREMIUM';
    const amount = searchParams.get('amount') || '5000';
    const cycle = searchParams.get('cycle') || 'monthly';

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    // 🎯 Pegamos o ID do usuário do localStorage (ou contexto)
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '';
    const { submitReceipt } = usePayment(userId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file || !userId) return;

        setStatus('uploading');
        try {
            // Enviamos para o nosso backend NestJS via Hook
            await submitReceipt(file, plan as any, Number(amount));
            setStatus('success');

            // Redireciona após 3 segundos
            setTimeout(() => router.push('/mapa'), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="bg-emerald-500/20 p-6 rounded-full">
                    <CheckCircle2 size={80} className="text-emerald-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-black uppercase italic text-white">Recebemos o Teu Talão!</h1>
                <p className="text-muted-foreground max-w-md">
                    O nosso Soba está a validar o pagamento. Em breve o teu acesso Premium será libertado.
                </p>
                <button onClick={() => router.push('/mapa')} className="text-gold font-black uppercase tracking-widest text-xs border-b border-gold pb-1">
                    Voltar ao Mapa agora
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-gold mb-10 transition-colors uppercase text-[10px] font-black tracking-widest">
                <ArrowLeft size={16} /> Voltar
            </button>

            <div className="grid md:grid-cols-2 gap-12">
                {/* COLUNA 1: DADOS BANCÁRIOS */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-gold leading-none">Pagamento via Transferência</h1>
                        <p className="text-muted-foreground mt-4 text-sm font-medium">
                            Efetua o pagamento de <span className="text-gold font-bold">{Number(amount).toLocaleString('pt-AO')} Kz</span> para a conta abaixo e anexa o comprovativo.
                        </p>
                    </div>

                    <div className="bg-card p-6 rounded-3xl border border-muted space-y-4 shadow-xl">
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Banco</p>
                            <p className="font-bold text-lg">Millennium (Banco Millennium Atlântico)</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">IBAN</p>
                            <p className="font-mono text-gold font-bold break-all select-all">AO06 0055 0000 9830 9007 1017 4</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Titular</p>
                            <p className="font-bold uppercase italic">Nonhande - Digital Learning Lda</p>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4">
                        <AlertCircle className="text-blue-500 shrink-0" />
                        <p className="text-[11px] text-black dark:text-white leading-relaxed font-medium">
                            O tempo de ativação médio é de 30 minutos em horário comercial. Pagamentos feitos via Multicaixa Express são aprovados mais rapidamente.
                        </p>
                    </div>
                </div>

                {/* COLUNA 2: UPLOAD */}
                <div className="bg-card/50 p-8 rounded-[40px] border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                    {preview ? (
                        <div className="w-full space-y-4">
                            <img src={preview} alt="Talão" className="w-full h-48 object-cover rounded-2xl border-2 border-gold/50" />
                            <p className="text-xs font-bold uppercase text-gold">Ficheiro Selecionado</p>
                            <button
                                onClick={() => {setFile(null); setPreview(null);}}
                                className="text-[10px] text-red-500 uppercase font-black"
                            >
                                Trocar Ficheiro
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-muted p-6 rounded-full">
                                <Upload size={40} className="text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase text-sm italic">Anexar Comprovativo</h3>
                                <p className="text-xs text-muted-foreground mt-2">JPG, PNG ou PDF (Máx. 5MB)</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || status === 'uploading'}
                        className={`
                            w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2
                            ${file && status !== 'uploading'
                            ? 'bg-gold text-white shadow-[0_6px_0_0_#b8860b] active:translate-y-1 active:shadow-none'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'}
                        `}
                    >
                        {status === 'uploading' ? (
                            <><Loader2 className="animate-spin" size={18} /> A Enviar...</>
                        ) : (
                            'Confirmar Pagamento'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-gold" size={40} /></div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}