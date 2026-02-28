import { cn } from "@/app/lib/utils";
import React from "react";

export function OrbitingCircles({
                                    className,
                                    children,
                                    reverse,
                                    duration = 20,
                                    radius = 50,
                                    path = true,
                                    speed = 1,
                                    ...props
                                }: any) {
    return (
        <>
            {path && (
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
                    <circle className="stroke-platinum/10 stroke-1" cx="50%" cy="50%" r={radius} fill="none" />
                </svg>
            )}
            <div
                style={{ "--duration": duration / speed, "--radius": radius } as React.CSSProperties}
                className={cn(
                    "absolute flex size-full animate-orbit items-center justify-center rounded-full",
                    reverse ? "[animation-direction:reverse]" : "",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </>
    );
}