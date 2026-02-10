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
    // Teus metadados...
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
