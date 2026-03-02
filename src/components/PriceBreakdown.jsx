import React, { memo } from 'react';
import { FORMATTER, PERCENT_FORMATTER } from '../utils/finance';

// BOLT: Optimize - use memo to prevent re-renders when parent renders but props haven't changed.
const PriceBreakdown = memo(({ cost, margin, tva }) => {
    // Safety check: if margin is negative, the pie chart metaphor breaks.
    // In that case, we don't render this component (the ProfitabilityBar handles the loss display).
    if (margin < 0) return null;

    const total = cost + margin + tva;

    if (!total || total <= 0) return null;

    const costPct = (cost / total) * 100;
    const marginPct = (margin / total) * 100;
    const tvaPct = (tva / total) * 100;

    // SVG Config
    const size = 120;
    const strokeWidth = 16; // Thinner stroke for a more modern look
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Offsets for stroke-dasharray
    // We start from top (-90deg rotation in CSS)
    // 1. Cost
    const costOffset = 0;
    // 2. Margin starts after Cost
    const marginOffset = -((costPct / 100) * circumference);
    // 3. TVA starts after Margin
    const tvaOffset = -(((costPct + marginPct) / 100) * circumference);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-between h-full min-h-[220px]">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Structure du Prix TTC</h4>

            <div className="relative w-28 h-28 flex items-center justify-center my-4">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                    />

                    {/* Cost Segment (Slate) */}
                    {costPct > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="#cbd5e1"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${(costPct / 100) * circumference} ${circumference}`}
                            strokeDashoffset={costOffset}
                        />
                    )}

                    {/* Margin Segment (Emerald) */}
                    {marginPct > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="#10b981"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${(marginPct / 100) * circumference} ${circumference}`}
                            strokeDashoffset={marginOffset}
                        />
                    )}

                    {/* TVA Segment (Indigo) */}
                    {tvaPct > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="#6366f1"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${(tvaPct / 100) * circumference} ${circumference}`}
                            strokeDashoffset={tvaOffset}
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Total</span>
                    <span className="text-sm font-black text-slate-800">{FORMATTER.format(total)}</span>
                </div>
            </div>

            <div className="w-full space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                        <span className="text-slate-500 font-semibold">Coûts</span>
                    </div>
                    <span className="font-bold text-slate-700">{PERCENT_FORMATTER.format(costPct/100)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-500 font-semibold">Marge</span>
                    </div>
                    <span className="font-bold text-slate-700">{PERCENT_FORMATTER.format(marginPct/100)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-slate-500 font-semibold">TVA</span>
                    </div>
                    <span className="font-bold text-slate-700">{PERCENT_FORMATTER.format(tvaPct/100)}</span>
                </div>
            </div>
        </div>
    );
});

export default PriceBreakdown;
