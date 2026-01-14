import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    backHref?: string;
}

export default function PageHeader({ title, subtitle, backHref = "/" }: PageHeaderProps) {
    return (
        <header className="mb-12">
            <Link
                href={backHref}
                className="w-10 h-10 mb-6 flex items-center justify-center border border-border-custom rounded-full text-silver-dark hover:text-gold hover:border-gold transition-all"
            >
                <ArrowLeft size={20} />
            </Link>
            <span className="text-[10px] font-black tracking-[0.4em] text-gold uppercase mb-2 block">
                {subtitle}
            </span>
            <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">
                {title}
            </h1>
        </header>
    );
}