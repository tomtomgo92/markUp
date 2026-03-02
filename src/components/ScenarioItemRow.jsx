import React, { memo } from 'react';
import { Trash2, Calculator } from 'lucide-react';
import ConfirmButton from './ui/ConfirmButton';

const ScenarioItemRow = memo(({ item, index, mode, onUpdate, onRemove, onOpenCalculator, onAddItem, isClientMode }) => {
    // Calculate itemMargin and itemMarginPercent for display
    const itemMargin = (parseFloat(item.pv) || 0) - (parseFloat(item.cost) || 0);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onAddItem();
        }
    };
    const itemMarginPercent = parseFloat(item.pv) ? (itemMargin / parseFloat(item.pv)) * 100 : 0;

    const handleMarginPercentChange = (e) => {
        const val = parseFloat(e.target.value) || 0;
        if (mode === 'cost_percent') {
            const cost = parseFloat(item.cost) || 0;
            const newPv = cost !== 0 ? (cost / (1 - (val / 100))) : 0;
            onUpdate(item.id, 'pv', newPv.toFixed(0));
        } else if (mode === 'pv_percent') {
            const pv = parseFloat(item.pv) || 0;
            const newCost = pv * (1 - (val / 100));
            onUpdate(item.id, 'cost', newCost.toFixed(0));
        }
    };

    return (
        <tr className="group even:bg-white hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-0">
            <td className="p-3 text-slate-400 font-medium text-xs">{index + 1}</td>
            <td className="p-3">
                <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700"
                    placeholder="Nom..."
                    aria-label={`Nom de la ligne ${index + 1}`}
                />
            </td>
            {!isClientMode && (
                <td className="p-3">
                    <div className="relative flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="number"
                                value={item.cost}
                                disabled={mode === 'pv_percent'}
                                onChange={(e) => onUpdate(item.id, 'cost', e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={(e) => e.target.select()}
                                className={`w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700 ${mode === 'pv_percent' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="0"
                                aria-label={`Coût de la ligne ${item.name || index + 1}`}
                            />
                            <span className="text-xs text-slate-400 absolute right-8 top-1.5 pointer-events-none">€</span>
                        </div>
                        {onOpenCalculator && mode !== 'pv_percent' && (
                            <button
                                onClick={() => onOpenCalculator(item.id, 'cost')}
                                className="outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors print-hidden"
                                title="Calculer au CJM"
                                aria-label="Ouvrir calculateur CJM"
                            >
                                <Calculator size={14} />
                            </button>
                        )}
                    </div>
                </td>
            )}
            <td className="p-3">
                <div className="relative flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="number"
                            value={item.pv}
                            disabled={mode === 'cost_percent'}
                            onChange={(e) => onUpdate(item.id, 'pv', e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={(e) => e.target.select()}
                            className={`w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700 ${mode === 'cost_percent' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="0"
                            aria-label={`Prix de vente de ${item.name || index + 1}`}
                        />
                        <span className="text-xs text-slate-400 absolute right-8 top-1.5 pointer-events-none">€</span>
                    </div>
                    {onOpenCalculator && mode !== 'cost_percent' && (
                        <button
                            onClick={() => onOpenCalculator(item.id, 'pv')}
                            className="outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors print-hidden"
                            title="Calculer au TJM"
                            aria-label="Ouvrir calculateur TJM"
                        >
                            <Calculator size={14} />
                        </button>
                    )}
                </div>
            </td>
            {!isClientMode && (
                <td className="p-3 text-right">
                    <div className="flex flex-col items-end">
                        <span className={`font-bold ${itemMargin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {itemMargin.toFixed(0)}€
                        </span>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <div
                                className={`w-2 h-2 rounded-full ${itemMarginPercent >= 40 ? 'bg-emerald-500' :
                                    itemMarginPercent >= 20 ? 'bg-amber-500' :
                                        'bg-red-500'
                                    }`}
                                title={`Santé de la marge: ${itemMarginPercent >= 40 ? 'Excellente' : itemMarginPercent >= 20 ? 'Moyenne' : 'Critique'}`}
                                aria-hidden="true"
                            />
                            {(mode === 'cost_percent' || mode === 'pv_percent') ? (
                                <div className="flex items-center justify-end gap-0.5">
                                    <input
                                        type="number"
                                        value={itemMarginPercent.toFixed(1)}
                                        onChange={handleMarginPercentChange}
                                        onFocus={(e) => e.target.select()}
                                        className="w-12 px-1 py-0.5 text-right text-[10px] font-bold text-slate-500 bg-transparent border-b border-slate-200 hover:border-indigo-300 focus:border-indigo-500 outline-none"
                                        aria-label={`Pourcentage de marge de ${item.name || 'la ligne'}`}
                                    />
                                    <span className="text-[10px] text-slate-400">%</span>
                                </div>
                            ) : (
                                <span className="text-[10px] text-slate-400">{itemMarginPercent.toFixed(1)}%</span>
                            )}
                        </div>
                    </div>
                </td>
            )}
            <td className="p-3 text-right print-hidden">
                <ConfirmButton
                    onConfirm={() => onRemove(item.id)}
                    icon={Trash2}
                    label={`Supprimer la ligne ${item.name || 'sans nom'}`}
                    message="Suppr ?"
                    size={14}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    activeClassName="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-100"
                />
            </td>
        </tr>
    );
});

export default ScenarioItemRow;
