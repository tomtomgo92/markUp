import React, { useState } from 'react';
import {
    Building2,
    Trash2,
    Plus,
    Euro,
    Wallet,
    PieChart,
    ChevronDown,
} from 'lucide-react';
import InputGroup from './ui/InputGroup';
import ResultCard from './ui/ResultCard';
import { calculateResults, FORMATTER, PERCENT_FORMATTER, TAX_CONFIG } from '../utils/finance';

const ScenarioCard = ({ s, onUpdate, onRemove, index }) => {
    const [isHovered,setIsHovered] = useState(false);


    // --- MANAGE ITEMS ---
    const addItem = () => {
        const newItems = [
            ...(s.items || []),
            { id: Date.now(), name: `Ligne ${(s.items?.length || 0) + 1}`, pv: 0, cost: 0 }
        ];
        onUpdate(s.id, 'items', newItems);
    };

    const updateItem = (itemId, field, value) => {
        const val = parseFloat(value) || 0;
        const newItems = s.items.map(item => {
            if (item.id === itemId) {
                let updates = { [field]: value };

                // Auto-calculate logic based on mode
                if (s.mode === 'cost_percent' && field === 'cost') {
                    const margin = parseFloat(s.marginPercent) || 0;
                    const newPv = val !== 0 ? (val / (1 - (margin / 100))) : 0;
                    updates.pv = newPv.toFixed(2);
                } else if (s.mode === 'pv_percent' && field === 'pv') {
                    const margin = parseFloat(s.marginPercent) || 0;
                    const newCost = val * (1 - (margin / 100));
                    updates.cost = newCost.toFixed(2);
                }

                return { ...item, ...updates };
            }
            return item;
        });
        onUpdate(s.id, 'items', newItems);
    };

    const updateGlobalMargin = (value) => {
        const margin = parseFloat(value) || 0;
        const newItems = s.items.map(item => {
            const cost = parseFloat(item.cost) || 0;
            const pv = parseFloat(item.pv) || 0;

            if (s.mode === 'cost_percent') {
                const newPv = cost !== 0 ? (cost / (1 - (margin / 100))) : 0;
                return { ...item, pv: newPv.toFixed(2) };
            } else if (s.mode === 'pv_percent') {
                const newCost = pv * (1 - (margin / 100));
                return { ...item, cost: newCost.toFixed(2) };
            }
            return item;
        });

        // Batch update: margin AND items
        onUpdate(s.id, { marginPercent: value, items: newItems });
    };

    const removeItem = (itemId) => {
        const newItems = s.items.filter(item => item.id !== itemId);
        onUpdate(s.id, 'items', newItems);
    };

    const toggleDetailMode = () => {
        const newIsDetailed = !s.isDetailed;
        onUpdate(s.id, 'isDetailed', newIsDetailed);
        // Initialize items if switching to detailed and empty
        if (newIsDetailed && (!s.items || s.items.length === 0)) {
            onUpdate(s.id, 'items', [{ id: Date.now(), name: 'Prestation 1', pv: s.pv, cost: s.cost }]);
        }
    };

    const res = calculateResults(s);

    // Handlers
    const handleChange = (field, val) => onUpdate(s.id, field, val);

    const handleSmartChange = (field, value) => {
        if (s.isDetailed) return; // Disable smart changes in detailed mode (values are derived)

        const val = parseFloat(value) || 0;

        if (s.mode === 'pv_cost') {
            if (field === 'pv') {
                const newMarginPercent = val !== 0 ? ((val - s.cost) / val) * 100 : 0;
                onUpdate(s.id, 'marginPercent', newMarginPercent);
            } else if (field === 'cost') {
                const newMarginPercent = s.pv !== 0 ? ((s.pv - val) / s.pv) * 100 : 0;
                onUpdate(s.id, 'marginPercent', newMarginPercent);
            }
        }
        handleChange(field, value);
    };

    return (
        <div
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header Carte */}
            <div className="bg-slate-50/50 backdrop-blur-sm p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 text-indigo-600 font-bold text-lg h-10 w-10 flex items-center justify-center">
                        {index + 1}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={s.name}
                            onChange={(e) => onUpdate(s.id, 'name', e.target.value)}
                            className="font-bold text-slate-800 text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors w-full"
                            placeholder="Nom du scénario"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={s.mode}
                            onChange={(e) => handleChange('mode', e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="pv_cost">PV & Coût</option>
                            <option value="cost_percent">Marge & Coût</option>
                            <option value="pv_percent">Marge & PV</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                    <button
                        onClick={() => onRemove(s.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer ce scénario"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-8 space-y-8">
                    <div className="space-y-4">


                        {(s.mode === 'cost_percent' || s.mode === 'pv_percent') && (
                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                        <PieChart size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-indigo-900 text-sm">Marge Cible Globale</h4>
                                        <p className="text-xs text-indigo-600/80">S'applique à toutes les lignes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={s.marginPercent}
                                        onChange={(e) => updateGlobalMargin(e.target.value)}
                                        className="w-20 px-3 py-1.5 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none text-right font-bold text-indigo-700"
                                        placeholder="0"
                                    />
                                    <span className="font-bold text-indigo-400">%</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-2">
                                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lignes du projet</h4>
                                <button onClick={addItem} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                    <Plus size={14} /> Ajouter une ligne
                                </button>
                            </div>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3 w-10">#</th>
                                            <th className="p-3">Libellé</th>
                                            <th className="p-3">Coût</th>
                                            <th className="p-3">PV</th>
                                            <th className="p-3 text-right">Marge</th>
                                            <th className="p-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {s.items?.map((item, i) => {
                                            const itemMargin = (parseFloat(item.pv) || 0) - (parseFloat(item.cost) || 0);
                                            const itemMarginPercent = parseFloat(item.pv) ? (itemMargin / parseFloat(item.pv)) * 100 : 0;
                                            return (
                                                <tr key={item.id} className="group even:bg-white hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-0">
                                                    <td className="p-3 text-slate-400 font-medium text-xs">{i + 1}</td>
                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                            className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700"
                                                            placeholder="Nom..."
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={item.cost}
                                                                disabled={s.mode === 'pv_percent'}
                                                                onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                                                                className={`w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700 ${s.mode === 'pv_percent' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                placeholder="0"
                                                            />
                                                            <span className="text-xs text-slate-400 absolute right-8 top-1.5 pointer-events-none">€</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={item.pv}
                                                                disabled={s.mode === 'cost_percent'}
                                                                onChange={(e) => updateItem(item.id, 'pv', e.target.value)}
                                                                className={`w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700 ${s.mode === 'cost_percent' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                placeholder="0"
                                                            />
                                                            <span className="text-xs text-slate-400 absolute right-8 top-1.5 pointer-events-none">€</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className={`font-bold ${itemMargin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                {itemMargin.toFixed(0)}€
                                                            </span>
                                                            {(s.mode === 'cost_percent' || s.mode === 'pv_percent') ? (
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={itemMarginPercent.toFixed(1)}
                                                                        onChange={(e) => {
                                                                            const val = parseFloat(e.target.value) || 0;
                                                                            if (s.mode === 'cost_percent') {
                                                                                const cost = parseFloat(item.cost) || 0;
                                                                                const newPv = cost !== 0 ? (cost / (1 - (val / 100))) : 0;
                                                                                updateItem(item.id, 'pv', newPv.toFixed(2));
                                                                            } else if (s.mode === 'pv_percent') {
                                                                                const pv = parseFloat(item.pv) || 0;
                                                                                const newCost = pv * (1 - (val / 100));
                                                                                updateItem(item.id, 'cost', newCost.toFixed(2));
                                                                            }
                                                                        }}
                                                                        className="w-12 px-1 py-0.5 text-right text-[10px] font-bold text-slate-500 bg-transparent border-b border-slate-200 hover:border-indigo-300 focus:border-indigo-500 outline-none"
                                                                    />
                                                                    <span className="text-[10px] text-slate-400">%</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400">{itemMarginPercent.toFixed(1)}%</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {(!s.items || s.items.length === 0) && (
                                            <tr>
                                                <td colSpan="6" className="p-6 text-center text-slate-400 text-xs italic">
                                                    Aucune ligne. Ajoutez des postes de dépenses et de revenus.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    {s.items && s.items.length > 0 && (
                                        <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200">
                                            <tr>
                                                <td className="p-3 text-xs uppercase tracking-wider text-right" colSpan="2">Total</td>
                                                <td className="p-3 text-indigo-900">{res.cost.toFixed(2)}€</td>
                                                <td className="p-3 text-indigo-900">{res.pv.toFixed(2)}€</td>
                                                <td className="p-3 text-right text-emerald-600">{(res.pv - res.cost).toFixed(2)}€</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ResultCard
                        title="Prix Vente HT"
                        value={FORMATTER.format(res.pv)}
                        type="neutral"
                    />
                    <ResultCard
                        title="TVA (20%)"
                        value={FORMATTER.format(res.tva)}
                        type="neutral"
                    />
                    <ResultCard
                        title="TTC Client"
                        value={FORMATTER.format(res.ttc)}
                        type="primary"
                    />
                </div>


                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Détails</p>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className="text-slate-500 font-medium">Marge Brute (HT)</span>
                            <span className="font-bold text-slate-700">{FORMATTER.format(res.marginEuro)}</span>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className="text-slate-500 font-medium">Bénéfice Net (Après IS)</span>
                            <span className="font-bold text-slate-700">+{FORMATTER.format(res.netProfit)}</span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ScenarioCard;
