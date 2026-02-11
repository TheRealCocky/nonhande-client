import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";
// ✅ Importamos o Provider que criaste
import { UserProvider } from '@/contexts/UserContext';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// ... (Metadados mantidos exatamente como estão no teu código)
export const metadata: Metadata = {
    title: "Nonhande | Conhecimento e Identidade",
    description: "A plataforma líder na preservação e ensino da cultura, história e sabedoria de Angola através de tecnologia avançada.",
    keywords: ["Angola", "Educação Inteligente", "Cultura Angolana", "Património", "EdTech", "Inteligência Artificial"],
    authors: [{ name: "Nonhande" }],
    icons: {
        icon: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png",
        shortcut: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png",
        apple: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png",
    },
    openGraph: {
        title: "Nonhande | O Futuro do Conhecimento Angolano",
        description: "Muito mais do que aprendizagem: uma imersão profunda na identidade e no saber ancestral de Angola.",
        url: "https://nonhande.com",
        siteName: "Nonhande",
        images: [
            {
                url: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png",
                width: 1200,
                height: 630,
                alt: "Nonhande - Ecossistema de Conhecimento Angolano",
            },
        ],
        locale: "pt_AO",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Nonhande | Conhecimento e Identidade",
        description: "A elevar a sabedoria de Angola ao próximo nível tecnológico.",
        images: ["https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png"],
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    return (
        <html lang="pt-AO">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {/* ✅ O UserProvider deve envolver o children para que todas as
                    páginas (Map, Lesson, Shop) tenham acesso ao "Cérebro" global */}
        <UserProvider>
            {children}
        </UserProvider>

        {gaId && <GoogleAnalytics gaId={gaId} />}
        </body>
        </html>
    );
}
