export const HexagonBackground = ({ className }: { className?: string }) => (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                    <path d="M25 0L50 14.4V43.4L25 57.8L0 43.4V14.4L25 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
    </div>
);