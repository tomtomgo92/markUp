import React from 'react';

const Badge = ({ children, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        purple: "bg-purple-50 text-purple-700 border-purple-200",
        slate: "bg-slate-100 text-slate-700 border-slate-200"
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${colors[color] || colors.slate}`}>
            {children}
        </span>
    );
};

export default Badge;
