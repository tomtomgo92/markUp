import React, { useState } from 'react';
import {
    Building2,
    Trash2,
    Plus,
    Euro,
    Wallet,
    PieChart,
    ChevronDown,
    ArrowRight
} from 'lucide-react';
import InputGroup from './ui/InputGroup';
import ResultCard from './ui/ResultCard';
import { calculateResults, FORMATTER, PERCENT_FORMATTER, TAX_CONFIG } from '../utils/finance';

const ScenarioCard = ({ s, onUpdate, onRemove, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    // --- MANAGE ITEMS ---
    const addItem = () => {
        const newItems = [
            ...(s.items || []),
            { id: Date.now(), name: `Ligne ${(s.items?.length || 0) + 1}`, pv: 0, cost: 0 }
        ];
        onUpdate(s.id, 'items', newItems);
    };

    const updateItem = (itemId, field, value) => {
        const newItems = s.items.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        );
        onUpdate(s.id, 'items', newItems);
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
                        <h3 className="font-bold text-slate-800">{s.name || `Projet #${index + 1}`}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Building2 size={12} /> Simulation</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                    <button
                        onClick={toggleDetailMode}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${s.isDetailed ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                    >
                        {s.isDetailed ? 'Mode Détail' : 'Mode Global'}
                    </button>
                    {!s.isDetailed && (
                        <div className="relative">
                            <select
                                value={s.mode}
                                onChange={(e) => handleChange('mode', e.target.value)}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
                            >
                                <option value="pv_cost">Défini par PV & Coût</option>
                                <option value="cost_percent">Objectif Marge sur Coût</option>
                                <option value="pv_percent">Objectif Marge sur PV</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    )}
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

                {s.isDetailed ? (
                    /* SECTION DETAILS LINES */
                    <div className="space-y-4">
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
                                                <tr key={item.id} className="group hover:bg-white transition-colors">
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
                                                                onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                                                                className="w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700"
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
                                                                onChange={(e) => updateItem(item.id, 'pv', e.target.value)}
                                                                className="w-24 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent focus:bg-white outline-none font-bold text-slate-700"
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
                                                            <span className="text-[10px] text-slate-400">{itemMarginPercent.toFixed(1)}%</span>
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
                ) : (
                    /* SECTION INPUTS (GLOBAL MODE) */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup
                            label="Prix de Vente HT"
                            value={s.mode === 'cost_percent' ? res.pv.toFixed(2) : s.pv}
                            onChange={(e) => handleSmartChange('pv', e.target.value)}
                            disabled={s.mode === 'cost_percent'}
                            icon={Euro}
                            suffix="EUR"
                        />
                        <InputGroup
                            label="Coût de revient HT"
                            value={s.mode === 'pv_percent' ? res.cost.toFixed(2) : s.cost}
                            onChange={(e) => handleSmartChange('cost', e.target.value)}
                            disabled={s.mode === 'pv_percent'}
                            icon={Wallet}
                            suffix="EUR"
                        />
                        <InputGroup
                            label="Marge Commerciale"
                            value={s.mode === 'pv_cost' ? (res.marginPercent * 100).toFixed(2) : s.marginPercent}
                            onChange={(e) => handleSmartChange('marginPercent', e.target.value)}
                            disabled={s.mode === 'pv_cost'}
                            icon={PieChart}
                            suffix="%"
                        />
                    </div>
                )}

                {/* SECTION RESULTATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultCard
                        title="Marge Brute (HT)"
                        value={FORMATTER.format(res.marginEuro)}
                        subtext={`Soit ${PERCENT_FORMATTER.format(res.marginPercent)} du chiffre d'affaires`}
                        type="success"
                    />
                    <ResultCard
                        title="Bénéfice Net (Après IS)"
                        value={FORMATTER.format(res.netProfit)}
                        subtext={`Impôt estimé: ${FORMATTER.format(res.is)} (${res.marginEuro > TAX_CONFIG.SEUIL_IS ? '25%' : '15%'})`}
                        type="primary"
                    />
                </div>

                {/* DETAILS FISCAUX */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Récapitulatif Fiscal & TTC</p>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className="text-slate-500 font-medium">Prix Vente HT</span>
                            <span className="font-bold text-slate-700">{FORMATTER.format(res.pv)}</span>
                        </div>
                        <div className="hidden sm:block text-slate-300">
                            <ArrowRight size={14} />
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className="text-slate-500 font-medium">TVA (20%)</span>
                            <span className="font-bold text-slate-700">+{FORMATTER.format(res.tva)}</span>
                        </div>
                        <div className="hidden sm:block text-slate-300">
                            <div className="h-4 w-[1px] bg-slate-200"></div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4 p-2 bg-indigo-50/50 rounded-lg">
                            <span className="text-indigo-600 font-bold uppercase text-xs">Total TTC Client</span>
                            <span className="font-black text-indigo-700">{FORMATTER.format(res.ttc)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ScenarioCard;
