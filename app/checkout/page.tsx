'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import Image from 'next/image';
import { PaymentPlan } from '@/types/payment';
import { Toaster, toast } from 'sonner';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Parâmetros da URL
    const plan = (searchParams.get('plan') as PaymentPlan) || 'PREMIUM';
    const amount = searchParams.get('amount') || '5000';
    const cycle = searchParams.get('cycle') || 'monthly';

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '';
    const { submitReceipt } = usePayment(userId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validar tamanho máximo de 5MB
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("O ficheiro é muito grande. Máximo 5MB.");
                return;
            }

            setFile(selectedFile);

            // Limpa o preview antigo se existir
            if (preview) URL.revokeObjectURL(preview);
            setPreview(URL.createObjectURL(selectedFile));

            toast.success("Comprovativo selecionado!");
        }
    };

    const handleUpload = async () => {
        if (!file || !userId) {
            toast.error("Anexa o comprovativo antes de confirmar.");
            return;
        }

        setStatus('uploading');
        const toastId = toast.loading("A enviar talão para o Soba...");

        try {
            // Enviamos o arquivo, plano, valor e o ciclo (exigido pelo backend)
            await submitReceipt(file, plan, Number(amount), cycle);

            setStatus('success');
            toast.success("Enviado com sucesso!", { id: toastId });

            // Redireciona após 3 segundos
            setTimeout(() => router.push('/mapa'), 3000);
        } catch (error) {
            console.error("Erro no upload:", error);
            setStatus('error');
            toast.error("Falha no envio. Tenta novamente.", { id: toastId });
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
                <button
                    onClick={() => router.push('/mapa')}
                    className="text-gold font-black uppercase tracking-widest text-xs border-b border-gold pb-1 hover:text-white transition-colors"
                >
                    Voltar ao Mapa agora
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-gold mb-10 transition-colors uppercase text-[10px] font-black tracking-widest"
            >
                <ArrowLeft size={16} /> Voltar
            </button>

            <div className="grid md:grid-cols-2 gap-12">
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
                            <p className="font-bold text-lg text-white">Millennium (Atlântico)</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">IBAN</p>
                            <p className="font-mono text-gold font-bold break-all select-all">AO06 0055 0000 9830 9007 1017 4</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Titular</p>
                            <p className="font-bold uppercase italic text-white">Nonhande - Digital Learning Lda</p>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4">
                        <AlertCircle className="text-blue-500 shrink-0" />
                        <p className="text-[11px] text-white leading-relaxed font-medium">
                            O tempo de ativação médio é de 30 minutos em horário comercial angolano.
                        </p>
                    </div>
                </div>

                <div className="bg-card/50 p-8 rounded-[40px] border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                    {preview ? (
                        <div className="w-full space-y-4 flex flex-col items-center">
                            <div className="relative w-full h-64">
                                <Image
                                    src={preview}
                                    alt="Talão"
                                    fill
                                    className="object-contain rounded-2xl border-2 border-gold/50 bg-black/20"
                                />
                            </div>
                            <p className="text-xs font-bold uppercase text-gold">Comprovativo Selecionado</p>
                            <button
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="text-[10px] text-red-500 uppercase font-black hover:underline"
                            >
                                Remover e trocar
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-muted p-6 rounded-full">
                                <Upload size={40} className="text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black uppercase text-sm italic text-white">Anexar Comprovativo</h3>
                                <p className="text-[10px] text-muted-foreground uppercase">PNG, JPG ou PDF (Max 5MB)</p>
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
                            ? 'bg-gold text-white shadow-[0_6px_0_0_#b8860b] active:translate-y-1 hover:brightness-110'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'}
                        `}
                    >
                        {status === 'uploading' ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Enviando...
                            </>
                        ) : 'Confirmar Pagamento'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Componente de notificações posicionado no topo */}
            <Toaster position="top-center" richColors />

            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="animate-spin text-gold" size={40} />
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}