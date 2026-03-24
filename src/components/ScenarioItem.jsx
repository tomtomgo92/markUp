import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';

const ScenarioItem = memo(({ item, index, mode, onUpdateItem, onRemoveItem }) => {
    const itemMargin = (parseFloat(item.pv) || 0) - (parseFloat(item.cost) || 0);
    const itemMarginPercent = parseFloat(item.pv) ? (itemMargin / parseFloat(item.pv)) * 100 : 0;

    return (
        <tr className="group even:bg-white hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-0">
            <td className="p-3 text-slate-400 font-medium text-xs">{index + 1}</td>
            <td className="p-3">
                <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700"
                    placeholder="Nom..."
                    aria-label="Nom de la ligne"
                />
            </td>
            <td className="p-3">
                <div className="relative">
                    <input
                        type="number"
                        value={item.cost}
                        disabled={mode === 'pv_percent'}
                        title={mode === 'pv_percent' ? "Le coût est calculé automatiquement dans ce mode" : ""}
                        onChange={(e) => onUpdateItem(item.id, 'cost', e.target.value)}
                        className={`w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700 ${mode === 'pv_percent' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="0"
                        aria-label="Coût de la ligne"
                    />
                    <span className="text-xs text-slate-400 absolute right-8 top-1.5 pointer-events-none">€</span>
                </div>
            </td>
            <td className="p-3">
                <div className="relative">
                    <input
                        type="number"
                        value={item.pv}
                        disabled={mode === 'cost_percent'}
                        title={mode === 'cost_percent' ? "Le prix est calculé automatiquement dans ce mode" : ""}
                        onChange={(e) => onUpdateItem(item.id, 'pv', e.target.value)}
                        className={`w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700 ${mode === 'cost_percent' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="0"
                        aria-label="Prix de vente de la ligne"
                    />
                    <span className="text-xs text-slate-400 absolute right-8 top-1.5 pointer-events-none">€</span>
                </div>
            </td>
            <td className="p-3 text-right">
                <div className="flex flex-col items-end">
                    <span className={`font-bold ${itemMargin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {itemMargin.toFixed(0)}€
                    </span>
                    {(mode === 'cost_percent' || mode === 'pv_percent') ? (
                        <div className="flex items-center justify-end gap-1">
                            <input
                                type="number"
                                value={itemMarginPercent.toFixed(1)}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    if (mode === 'cost_percent') {
                                        const cost = parseFloat(item.cost) || 0;
                                        const newPv = cost !== 0 ? (cost / (1 - (val / 100))) : 0;
                                        onUpdateItem(item.id, 'pv', newPv.toFixed(0));
                                    } else if (mode === 'pv_percent') {
                                        const pv = parseFloat(item.pv) || 0;
                                        const newCost = pv * (1 - (val / 100));
                                        onUpdateItem(item.id, 'cost', newCost.toFixed(0));
                                    }
                                }}
                                className="w-12 px-1 py-0.5 text-right text-[10px] font-bold text-slate-500 bg-transparent border-b border-slate-200 hover:border-indigo-300 focus:border-indigo-500 outline-none"
                                aria-label="Pourcentage de marge de la ligne"
                            />
                            <span className="text-[10px] text-slate-400">%</span>
                        </div>
                    ) : (
                        <span className="text-[10px] text-slate-400">{itemMarginPercent.toFixed(1)}%</span>
                    )}
                </div>
            </td>
            <td className="p-3 text-right">
                <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    aria-label={`Supprimer la ligne ${item.name || 'sans nom'}`}
                    title="Supprimer la ligne"
                >
                    <Trash2 size={14} aria-hidden="true" />
                </button>
            </td>
        </tr>
    );
});

export default ScenarioItem;
