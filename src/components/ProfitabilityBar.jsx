import React, { memo } from 'react';
import { FORMATTER, PERCENT_FORMATTER } from '../utils/finance';

// BOLT: Optimize - use memo to prevent re-renders when parent renders but props haven't changed.
const ProfitabilityBar = memo(({ pv, cost, is, netProfit }) => {
    // If no PV, don't show the bar
    if (!pv || pv <= 0) return null;

    // Check for loss (negative net profit)
    const isLoss = netProfit < 0;

    if (isLoss) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between text-red-700 font-bold text-sm mb-2">
                    <span>Marge Négative (Déficitaire)</span>
                    <span>{FORMATTER.format(netProfit)}</span>
                </div>
                <div className="w-full h-3 bg-red-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-full animate-pulse"></div>
                </div>
                <p className="text-xs text-red-500 mt-2 font-medium">Le coût dépasse le prix de vente.</p>
            </div>
        );
    }

    // Happy path calculation
    // We use Math.max(0, ...) to avoid negative widths in edge cases where cost > pv but logic hasn't caught it (though isLoss should catch it)
    const costPct = Math.min(100, Math.max(0, (cost / pv) * 100));
    // IS is calculated on margin, so it should be positive if margin is positive
    const taxPct = Math.min(100, Math.max(0, (is / pv) * 100));
    // Remaining is Net Profit
    const netPct = Math.min(100, Math.max(0, (netProfit / pv) * 100));

    return (
        <div className="mt-6 mb-2">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Répartition du Chiffre d'Affaires</h4>

            {/* The Bar */}
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner">
                {/* Cost Segment */}
                <div
                    style={{ width: `${costPct}%` }}
                    className="bg-slate-300 hover:bg-slate-400 transition-colors relative group"
                    title={`Coûts: ${FORMATTER.format(cost)}`}
                >
                </div>

                {/* Tax Segment */}
                {taxPct > 0 && (
                    <div
                        style={{ width: `${taxPct}%` }}
                        className="bg-amber-300 hover:bg-amber-400 transition-colors relative group"
                        title={`Impôts (IS): ${FORMATTER.format(is)}`}
                    >
                    </div>
                )}

                {/* Net Profit Segment */}
                <div
                    style={{ width: `${netPct}%` }}
                    className="bg-emerald-400 hover:bg-emerald-500 transition-colors relative group"
                    title={`Bénéfice Net: ${FORMATTER.format(netProfit)}`}
                >
                </div>
            </div>

            {/* Legend / Labels */}
            <div className="flex justify-between items-start mt-3 text-xs">
                {/* Cost Label */}
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="font-bold text-slate-600">Coûts</span>
                    </div>
                    <div className="pl-3.5 text-slate-400">
                        {PERCENT_FORMATTER.format(costPct/100)} <span className="hidden sm:inline">({FORMATTER.format(cost)})</span>
                    </div>
                </div>

                {/* Tax Label (Centered if possible, or just spaced) */}
                {is > 0 && (
                    <div className="flex flex-col gap-0.5 items-center hidden sm:flex">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                            <span className="font-bold text-slate-600">Impôts (IS)</span>
                        </div>
                        <div className="text-slate-400 text-center">
                             {PERCENT_FORMATTER.format(taxPct/100)} ({FORMATTER.format(is)})
                        </div>
                    </div>
                )}

                {/* Net Profit Label */}
                <div className="flex flex-col gap-0.5 items-end">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="font-bold text-emerald-700">Net Poche</span>
                    </div>
                    <div className="text-emerald-600 font-bold">
                         {PERCENT_FORMATTER.format(netPct/100)} <span className="hidden sm:inline">({FORMATTER.format(netProfit)})</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProfitabilityBar;
