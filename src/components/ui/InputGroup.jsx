import React from 'react';

const InputGroup = ({ label, value, onChange, icon: Icon, disabled, suffix }) => (
    <div className={`space-y-2 ${disabled ? 'opacity-50 grayscale' : ''}`}>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            {label}
            {disabled && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Calculé auto</span>}
        </label>
        <div className={`relative group transition-all duration-300 ${disabled ? '' : 'focus-within:scale-[1.02]'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className={`h-4 w-4 ${disabled ? 'text-slate-400' : 'text-slate-500 group-focus-within:text-indigo-600'}`} />
            </div>
            <input
                type="number"
                disabled={disabled}
                className={`block w-full pl-10 pr-12 py-3 sm:text-sm font-bold rounded-xl border-2 outline-none transition-colors
          ${disabled
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                value={value}
                onChange={onChange}
                step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold sm:text-sm">{suffix}</span>
            </div>
        </div>
    </div>
);

export default InputGroup;
