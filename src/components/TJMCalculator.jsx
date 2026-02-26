import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const TJMCalculator = ({ initialValue = 0, onApply, onClose }) => {
    // If initialValue is > 0, try to guess TJM/Days?
    // For simplicity, we keep default or start with 0 if initial is 0.
    // If we wanted to reverse engineer: if initialValue is 1500, maybe set TJM=500, Days=3?
    // Let's just use initialValue as a hint if it seems round, otherwise default 500.
    const [tjm, setTjm] = useState(500);
    const [days, setDays] = useState(1);
    const ref = useRef(null);

    const total = tjm * days;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute z-10 top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 min-w-[220px] animate-in fade-in zoom-in-95 duration-200"
        >
            <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Calcul TJM</h5>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">TJM (€/j)</label>
                        <input
                            type="number"
                            value={tjm}
                            onChange={(e) => setTjm(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                            placeholder="ex: 500"
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">Jours</label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                            placeholder="ex: 3"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-indigo-600 text-sm">{total}€</span>
                    <button
                        onClick={() => onApply(total)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    >
                        <Check size={14} />
                        Appliquer
                    </button>
                </div>
            </div>

            {/* Arrow */}
            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
        </div>
    );
};

export default TJMCalculator;
