import React from 'react';

const ResultCard = ({ title, value, subtext, type = "neutral" }) => {
    const styles = {
        neutral: "bg-white border-slate-200",
        primary: "bg-gradient-to-br from-primary to-secondary text-white border-transparent",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900"
    };

    return (
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between h-full ${styles[type]}`}>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${type === 'primary' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {title}
                </p>
                <p className={`text-2xl sm:text-2xl font-black ${type === 'success' ? 'text-emerald-700' : ''}`}>
                    {value}
                </p>
            </div>
            {subtext && (
                <p className={`text-xs font-medium mt-2 ${type === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {subtext}
                </p>
            )}
        </div>
    );
};

export default ResultCard;
