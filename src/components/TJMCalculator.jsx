import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const TJMCalculator = ({ initialValue = 0, onApply, onClose, mode = 'price' }) => {
    const [tjm, setTjm] = useState(500);
    const [days, setDays] = useState(1);
    const ref = useRef(null);

    const total = tjm * days;

    const label = mode === 'cost' ? 'CJM' : 'TJM';
    const title = mode === 'cost' ? 'Calcul CJM' : 'Calcul TJM';

    // Close on click outside or escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="bg-white p-4 w-full animate-in fade-in zoom-in-95 duration-200"
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">{title}</h5>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                        aria-label={`Fermer le calculateur ${mode === 'cost' ? 'CJM' : 'TJM'}`}
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-600">{label} (€/j)</label>
                        <input
                            type="number"
                            value={tjm}
                            onChange={(e) => setTjm(parseFloat(e.target.value) || 0)}
                            onFocus={(e) => e.target.select()}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 outline-none font-bold text-slate-700"
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
                            onFocus={(e) => e.target.select()}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 outline-none font-bold text-slate-700"
                            placeholder="ex: 3"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Total</span>
                        <span className="font-bold text-indigo-600 text-lg">{total}€</span>
                    </div>
                    <button
                        onClick={() => onApply(total)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold shadow-sm hover:shadow-md"
                    >
                        <Check size={16} />
                        Appliquer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TJMCalculator;
