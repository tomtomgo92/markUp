import React, { useEffect, useMemo } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { calculateResults, FORMATTER, PERCENT_FORMATTER } from '../utils/finance';

const ComparisonView = ({ scenarios, onClose, isClientMode }) => {
    // BOLT: Optimize - Memoize expensive calculations for ComparisonView
    // This prevents recalculating the array map and Math.max when `isClientMode` changes
    const { data, maxPV } = useMemo(() => {
        // 1. Calculate results for all scenarios
        const dataArray = scenarios.map(s => {
            const res = calculateResults(s);
            return {
                ...s,
                results: res
            };
        });

        // 2. Determine max PV to scale the chart
        const maxValue = Math.max(...dataArray.map(d => d.results.pv), 1); // Avoid div by 0

        return { data: dataArray, maxPV: maxValue };
    }, [scenarios]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" />
                            Comparateur de Scénarios
                        </h2>
                        <p className="text-slate-500 text-sm">Visualisez la rentabilité comparée de vos options</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        aria-label="Fermer le comparateur"
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>

                {/* Chart Area */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 sm:p-10 bg-white">
                    <div className="flex items-end justify-center gap-8 sm:gap-12 h-[400px] min-w-max mx-auto">
                        {data.map((item, index) => {
                            const { pv, cost, marginEuro, marginPercent, netProfit } = item.results;
                            const heightPercent = (pv / maxPV) * 100;

                            // Bar segments
                            const costHeight = pv > 0 ? (cost / pv) * 100 : 0;
                            const marginHeight = pv > 0 ? (marginEuro / pv) * 100 : 0;

                            // Color logic based on margin %
                            const isProfitable = marginPercent > 0.3; // Arbitrary threshold for green
                            const isLowMargin = marginPercent < 0.15;
                            const marginColor = isLowMargin ? 'bg-amber-400' : (isProfitable ? 'bg-emerald-500' : 'bg-emerald-400');

                            return (
                                <div key={item.id} className="flex flex-col items-center group w-32 sm:w-40">
                                    {/* Value Label (Top) */}
                                    <div className="mb-3 font-black text-slate-700 text-lg tracking-tight">
                                        {FORMATTER.format(pv)}
                                    </div>

                                    {/* The Bar */}
                                    <div
                                        className="w-full bg-slate-100 rounded-t-xl relative overflow-hidden flex flex-col justify-end transition-all duration-500 group-hover:shadow-lg"
                                        style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                    >
                                        {isClientMode ? (
                                            <div
                                                className="bg-indigo-500 w-full transition-all duration-500 flex items-center justify-center relative overflow-hidden h-full"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Margin Segment (Top) */}
                                                <div
                                                    className={`${marginColor} w-full transition-all duration-500 flex items-center justify-center relative overflow-hidden`}
                                                    style={{ height: `${marginHeight}%` }}
                                                >
                                                    {marginHeight > 15 && (
                                                        <span className="text-white font-bold text-xs drop-shadow-md">
                                                            Marge
                                                        </span>
                                                    )}
                                                    {/* Shine effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                                                </div>

                                                {/* Cost Segment (Bottom) */}
                                                <div
                                                    className="bg-slate-300 w-full transition-all duration-500 flex items-center justify-center border-t border-white/20"
                                                    style={{ height: `${costHeight}%` }}
                                                >
                                                    {costHeight > 15 && (
                                                        <span className="text-slate-500 font-bold text-xs">
                                                            Coût
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Scenario Name */}
                                    <div className="mt-4 text-center w-full">
                                        <div className="font-bold text-slate-800 truncate px-2" title={item.name}>
                                            {item.name}
                                        </div>
                                        {!isClientMode && (
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isLowMargin ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {PERCENT_FORMATTER.format(marginPercent)}
                                            </span>
                                        </div>
                                        )}
                                    </div>

                                    {/* Detailed metrics (hover/always visible depending on design) */}
                                    {!isClientMode && (
                                    <div className="mt-4 w-full bg-slate-50 rounded-lg p-2 text-xs space-y-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <div className="flex justify-between text-slate-500">
                                            <span>Coût:</span>
                                            <span className="font-medium">{FORMATTER.format(cost)}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-600 font-bold">
                                            <span>Net:</span>
                                            <span>{FORMATTER.format(netProfit)}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer / Legend */}
                {!isClientMode && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-6 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500"></div>
                        <span>Marge Brute</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-slate-300"></div>
                        <span>Coûts (Achats/Presta)</span>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonView;
