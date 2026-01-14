'use client';

import React from 'react';

export default function TrailSkeleton() {
    return (
        <div className="min-h-screen bg-background flex flex-col animate-pulse">
            <main className="px-6 max-w-3xl mx-auto w-full pt-16 pb-40">

                {/* Header Skeleton */}
                <header className="mb-12">
                    <div className="h-3 w-24 bg-border-custom/50 rounded mb-3"></div>
                    <div className="h-12 w-64 bg-border-custom/50 rounded-lg"></div>
                </header>

                <div className="space-y-12">
                    {/* Simulamos 2 unidades na trilha */}
                    {[1, 2].map((u) => (
                        <section key={u} className="border border-border-custom/30 rounded-2xl p-6">

                            {/* Title Unit Skeleton */}
                            <div className="mb-8">
                                <div className="h-3 w-20 bg-border-custom/40 rounded mb-2"></div>
                                <div className="h-8 w-48 bg-border-custom/40 rounded"></div>
                            </div>

                            {/* Lessons Zig-Zag Skeleton */}
                            <div className="flex flex-col items-center gap-8 py-4">
                                {[1, 2, 3].map((l, index) => (
                                    <div
                                        key={l}
                                        className="w-16 h-16 rounded-full bg-border-custom/20 border-2 border-border-custom/30"
                                        style={{
                                            transform: `translateX(${(index % 2 === 0 ? 20 : -20)}px)`
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* Mobile Nav Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border-custom/30 px-8 flex justify-between items-center">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-border-custom/20"></div>
                ))}
            </div>
        </div>
    );
}