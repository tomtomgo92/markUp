import React, { memo } from 'react';
import { FORMATTER } from '../utils/finance';

const WaterfallChart = memo(({ cost, margin, tva }) => {
    const total = cost + margin + tva;
    if (!total || total <= 0) return null;

    // Fixed height for the chart area
    const chartHeight = 150;

    // Scale factor
    const getScale = (val) => (val / total) * chartHeight;

    const costHeight = getScale(cost);
    const marginHeight = getScale(margin > 0 ? margin : 0);
    const tvaHeight = getScale(tva);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col h-full min-h-[220px]">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest text-center mb-4">Structure du Prix (Cascade)</h4>

            {/*
                We use a dedicated relative container for the bars so that `bottom: 0`
                is exactly the axis line. We separate the labels below this container.
            */}
            <div className="flex-1 relative mt-8 mb-6 mx-2" style={{ minHeight: `${chartHeight}px` }}>
                {/* Y-axis line */}
                <div className="absolute left-0 bottom-0 w-full h-[1px] bg-slate-200 z-0"></div>

                {/* Cost Bar */}
                <div className="absolute left-0 w-[33.33%] h-full flex justify-center items-end group">
                    <div
                        className="w-12 bg-slate-300 rounded-t-sm transition-all duration-300 hover:opacity-80 relative z-10"
                        style={{ height: `${costHeight}px` }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {FORMATTER.format(cost)}
                        </div>
                    </div>
                </div>

                {/* Connector Cost -> Margin */}
                <div
                    className="absolute w-[33.33%] border-t border-dashed border-slate-300 left-[16.66%] z-0"
                    style={{ bottom: `${costHeight}px` }}
                ></div>

                {/* Margin Bar */}
                <div className="absolute left-[33.33%] w-[33.33%] h-full flex justify-center items-end group">
                    <div
                        className="w-12 bg-emerald-400 rounded-t-sm transition-all duration-300 hover:opacity-80 relative z-10"
                        style={{
                            height: `${marginHeight}px`,
                            marginBottom: `${costHeight}px`
                        }}
                    >
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {FORMATTER.format(margin)}
                        </div>
                    </div>
                </div>

                 {/* Connector Margin -> TVA */}
                 <div
                    className="absolute w-[33.33%] border-t border-dashed border-slate-300 left-[50%] z-0"
                    style={{ bottom: `${costHeight + marginHeight}px` }}
                ></div>

                {/* TVA Bar */}
                <div className="absolute left-[66.66%] w-[33.33%] h-full flex justify-center items-end group">
                    <div
                        className="w-12 bg-indigo-400 rounded-t-sm transition-all duration-300 hover:opacity-80 relative z-10"
                        style={{
                            height: `${tvaHeight}px`,
                            marginBottom: `${costHeight + marginHeight}px`
                        }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {FORMATTER.format(tva)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Labels under the chart */}
            <div className="flex justify-between items-center mx-2 text-center">
                <div className="w-[33.33%] text-[10px] font-bold text-slate-500">Coût</div>
                <div className="w-[33.33%] text-[10px] font-bold text-emerald-600">Marge</div>
                <div className="w-[33.33%] text-[10px] font-bold text-indigo-600">TVA</div>
            </div>
        </div>
    );
});

export default WaterfallChart;
