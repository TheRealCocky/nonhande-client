import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Nonhande | Aprenda Nhaneca-Humbe",
        template: "%s | Nonhande"
    },
    description: "A voz das nossas raízes. Aprenda Nhaneca-Humbe com tecnologia de ponta, áudios reais e lições culturais preservando a identidade angolana.",
    metadataBase: new URL('https://nonhande.com'), // Substituir pelo domínio quando fizeres o deploy


    authors: [{ name: "Euclides Baltazar" }],
    creator: "Euclides Baltazar",
    publisher: "Euclides Baltazar",

    keywords: [
        "Angola",
        "Línguas Nacionais",
        "Nhaneca-Humbe",
        "Huíla",
        "Euclides Baltazar",
        "Cultura Angolana",
        "Dicionário Nhaneca",
        "Aprender Nhaneca",
        "Tecnologia Angola"
    ],

    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    icons: {
        icon: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505565/ICON_uklfwo.png",
        shortcut: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505565/ICON_uklfwo.png",
        apple: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505565/ICON_uklfwo.png",
    },

    // --- METADADOS PARA REDES SOCIAIS (WHATSAPP, INSTAGRAM, LINKEDIN) ---
    openGraph: {
        title: "Nonhande | A voz das nossas raízes",
        description: "Preservando o Nhaneca-Humbe através da tecnologia. Criado por Euclides Baltazar.",
        url: "https://nonhande.com",
        siteName: "Nonhande",
        images: [
            {
                url: "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png",
                width: 1200,
                height: 630,
                alt: "Nonhande - Plataforma de Línguas Nacionais de Angola",
            },
        ],
        locale: "pt_AO",
        type: "website",
    },

    // --- METADADOS PARA TWITTER / X ---
    twitter: {
        card: "summary_large_image",
        title: "Nonhande | Aprenda Nhaneca-Humbe",
        description: "A plataforma moderna para aprender línguas nacionais de Angola.",
        images: ["https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png"],
    },

    robots: {
        index: true,
        follow: true,
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-AO">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {children}
        </body>
        </html>
    );
}
