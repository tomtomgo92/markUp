import React from 'react';
import { Plus } from 'lucide-react';
import ScenarioItemRow from './ScenarioItemRow';

/**
 * ScenarioTable - Displays the list of items in a scenario with calculation results
 * 
 * @param {Object} props
 * @param {Array} props.items - List of items in the scenario
 * @param {string} props.mode - Calculation mode ('pv_cost', 'cost_percent', 'pv_percent')
 * @param {Function} props.onUpdateItem - Handler for item updates
 * @param {Function} props.onRemoveItem - Handler for item removal
 * @param {Function} props.onOpenCalculator - Handler for opening TJM calculator
 * @param {Function} props.onAddItem - Handler for adding a new item
 * @param {Object} props.results - Calculated results (pv, cost)
 */
const ScenarioTable = ({ 
    items, 
    mode, 
    onUpdateItem, 
    onRemoveItem, 
    onOpenCalculator, 
    onAddItem,
    results 
}) => {
    return (
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                        <th className="p-3 w-10">#</th>
                        <th className="p-3">Libellé</th>
                        <th className="p-3">Coût</th>
                        <th className="p-3">PV</th>
                        <th className="p-3 text-right">Marge</th>
                        <th className="p-3 w-10 print-hidden"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {items?.map((item, i) => (
                        <ScenarioItemRow
                            key={item.id}
                            item={item}
                            index={i}
                            mode={mode}
                            onUpdate={onUpdateItem}
                            onRemove={onRemoveItem}
                            onOpenCalculator={onOpenCalculator}
                            onAddItem={onAddItem}
                        />
                    ))}
                    {(!items || items.length === 0) && (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-500">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <p className="text-sm font-medium">Commencez par ajouter des éléments à chiffrer</p>
                                    <button
                                        onClick={onAddItem}
                                        className="outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm"
                                    >
                                        <Plus size={16} />
                                        Ajouter une ligne
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
                {items && items.length > 0 && (
                    <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200">
                        <tr>
                            <td className="p-3 text-xs uppercase tracking-wider text-right" colSpan="2">Total</td>
                            <td className="p-3 text-indigo-900">{results.cost.toFixed(2)}€</td>
                            <td className="p-3 text-indigo-900">{results.pv.toFixed(2)}€</td>
                            <td className="p-3 text-right text-emerald-600">{(results.pv - results.cost).toFixed(2)}€</td>
                            <td></td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default ScenarioTable;
