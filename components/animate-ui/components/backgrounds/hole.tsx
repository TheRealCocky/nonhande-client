export const HoleBackground = ({ className }: { className?: string }) => (
    <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--background)_70%)] z-10" />
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
    </div>
);