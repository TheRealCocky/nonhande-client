'use client';

import React from 'react';

export default function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-background py-10 px-6 animate-pulse transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                {/* Botão Voltar Fake */}
                <div className="w-12 h-12 bg-platinum/20 dark:bg-platinum/10 rounded-full mb-10" />

                <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-card-custom border border-platinum/20 dark:border-platinum/10 rounded-[40px] p-10 md:p-16 flex flex-col items-center">
                        <div className="h-5 w-24 bg-gold/20 dark:bg-gold/10 rounded-full mb-8" />
                        <div className="h-16 md:h-24 w-3/4 bg-platinum/30 dark:bg-platinum/20 rounded-2xl mb-6" />
                        <div className="h-8 w-1/2 bg-platinum/20 dark:bg-platinum/10 rounded-xl" />
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-card-custom border border-platinum/20 dark:border-platinum/10 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-gold/15 dark:bg-gold/10 rounded-full" />
                            <div className="h-3 w-16 bg-platinum/20 dark:bg-platinum/10 rounded" />
                        </div>
                        <div className="md:col-span-2 bg-card-custom border border-platinum/20 dark:border-platinum/10 rounded-[32px] p-8 flex gap-6 items-start">
                            <div className="w-12 h-12 bg-platinum/20 dark:bg-platinum/10 rounded-2xl shrink-0" />
                            <div className="space-y-3 w-full">
                                <div className="h-3 w-28 bg-platinum/20 dark:bg-platinum/10 rounded" />
                                <div className="h-4 w-full bg-platinum/10 dark:bg-platinum/5 rounded" />
                                <div className="h-4 w-2/3 bg-platinum/10 dark:bg-platinum/5 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}