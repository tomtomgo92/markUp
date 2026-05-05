import React, { memo } from 'react';

// BOLT: Optimize - use memo to prevent re-renders when parent renders but props haven't changed.
const ResultCard = memo(({ title, value, subtext, type = "neutral" }) => {
    const styles = {
        neutral: "bg-white border-slate-200",
        primary: "bg-gradient-to-br from-primary to-secondary text-white border-transparent shadow-lg shadow-indigo-200",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900"
    };

    return (
        <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full min-h-[220px] transition-all duration-300 overflow-hidden ${styles[type]}`}>
            <div className="flex flex-col h-full justify-between">
                <p className={`text-[11px] font-black uppercase tracking-widest ${type === 'primary' ? 'text-white/70' : 'text-slate-400'}`}>
                    {title}
                </p>
                <div className={`text-2xl font-black tracking-tight ${type === 'success' ? 'text-emerald-700' : ''} ${type === 'primary' ? 'text-white' : 'text-slate-900'}`}>
                    {value}
                </div>
            </div>
            {subtext && (
                <p className={`text-xs font-medium mt-2 ${type === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {subtext}
                </p>
            )}
        </div>
    );
});

export default ResultCard;
