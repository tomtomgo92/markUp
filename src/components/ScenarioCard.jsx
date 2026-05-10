import React, { memo, useRef, useCallback, useState, useMemo } from 'react';
import {
    Trash2,
    Plus,
    PieChart,
    ChevronDown,
    Copy,
    Percent,
    Calculator,
    Download,
    Info,
} from 'lucide-react';
import ConfirmButton from './ui/ConfirmButton';
import ResultCard from './ui/ResultCard';
import ProfitabilityBar from './ProfitabilityBar';
import PriceBreakdown from './PriceBreakdown';
import ScenarioTable from './ScenarioTable';
import TJMCalculator from './TJMCalculator';
import { calculateResults, FORMATTER, TAX_CONFIG, pvFromCost, costFromPv } from '../utils/finance';

// BOLT: Optimize - use memo to prevent re-renders when parent renders but props haven't changed.
// This is critical for list items where updating one item causes parent to re-render all items.
const ScenarioCard = memo(({ s, onUpdate, onRemove, onDuplicate, index }) => {
    // Stores { itemId, field } or null
    const [activeCalculator, setActiveCalculator] = useState(null);

    // BOLT: Optimize - Use useRef to keep track of the latest 's' prop without triggering re-renders in callbacks
    const sRef = useRef(s);
    sRef.current = s;

    const cardRef = useRef(null);

    const handlePrint = useCallback(() => {
        const card = cardRef.current;
        if (!card) { window.print(); return; }
        document.body.classList.add('print-single');
        card.classList.add('is-printing');
        const cleanup = () => {
            document.body.classList.remove('print-single');
            card.classList.remove('is-printing');
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }, []);

    // --- MANAGE ITEMS ---
    const addItem = useCallback(() => {
        const currentS = sRef.current;
        const newItems = [
            ...(currentS.items || []),
            { id: Date.now(), name: `Ligne ${(currentS.items?.length || 0) + 1}`, pv: 0, cost: 0 }
        ];
        onUpdate(currentS.id, 'items', newItems);
    }, [onUpdate]);

    const handleUpdateItem = useCallback((itemId, field, value) => {
        const currentScenario = sRef.current;
        const val = parseFloat(value) || 0;
        const newItems = currentScenario.items.map(item => {
            if (item.id === itemId) {
                let updates = { [field]: value };

                // Auto-calculate logic based on mode
                if (currentScenario.mode === 'cost_percent' && field === 'cost') {
                    const margin = parseFloat(currentScenario.marginPercent) || 0;
                    updates.pv = String(pvFromCost(val, margin));
                } else if (currentScenario.mode === 'pv_percent' && field === 'pv') {
                    const margin = parseFloat(currentScenario.marginPercent) || 0;
                    updates.cost = String(costFromPv(val, margin));
                }

                return { ...item, ...updates };
            }
            return item;
        });
        onUpdate(currentScenario.id, 'items', newItems);
    }, [onUpdate]);

    const handleRemoveItem = useCallback((itemId) => {
        const currentScenario = sRef.current;
        const newItems = currentScenario.items.filter(item => item.id !== itemId);
        onUpdate(currentScenario.id, 'items', newItems);
    }, [onUpdate]);

    const updateGlobalMarginEuro = useCallback((value) => {
        const currentS = sRef.current;
        const targetMarginEuro = parseFloat(value) || 0;

        const totalCost = currentS.items.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
        const totalPv = currentS.items.reduce((acc, item) => acc + (parseFloat(item.pv) || 0), 0);

        const newItems = currentS.items.map(item => {
            const cost = parseFloat(item.cost) || 0;
            const pv = parseFloat(item.pv) || 0;

            if (currentS.mode === 'cost_percent' || currentS.mode === 'pv_cost') {
                // Keep cost fixed, change PV
                let itemTargetMargin = 0;
                if (totalCost > 0) {
                    itemTargetMargin = targetMarginEuro * (cost / totalCost);
                } else if (currentS.items.length > 0) {
                    itemTargetMargin = targetMarginEuro / currentS.items.length;
                }
                const newPv = cost + itemTargetMargin;
                return { ...item, pv: newPv.toFixed(0) };
            } else if (currentS.mode === 'pv_percent') {
                // Keep PV fixed, change Cost
                let itemTargetMargin = 0;
                if (totalPv > 0) {
                    itemTargetMargin = targetMarginEuro * (pv / totalPv);
                } else if (currentS.items.length > 0) {
                    itemTargetMargin = targetMarginEuro / currentS.items.length;
                }
                const newCost = pv - itemTargetMargin;
                return { ...item, cost: newCost.toFixed(0) };
            }
            return item;
        });

        onUpdate(currentS.id, 'items', newItems);
    }, [onUpdate]);

    const updateGlobalMargin = useCallback((value) => {
        const currentS = sRef.current;
        const margin = parseFloat(value) || 0;
        const newItems = currentS.items.map(item => {
            const cost = parseFloat(item.cost) || 0;
            const pv = parseFloat(item.pv) || 0;

            if (currentS.mode === 'cost_percent') {
                return { ...item, pv: String(pvFromCost(cost, margin)) };
            } else if (currentS.mode === 'pv_percent') {
                return { ...item, cost: String(costFromPv(pv, margin)) };
            }
            return item;
        });

        // Batch update: margin
        onUpdate(currentS.id, { marginPercent: value, items: newItems });
    }, [onUpdate]);

    const toggleDetailMode = useCallback(() => {
        const currentScenario = sRef.current;
        const newIsDetailed = !currentScenario.isDetailed;
        onUpdate(currentScenario.id, 'isDetailed', newIsDetailed);
        // Initialize items if switching to detailed and empty
        if (newIsDetailed && (!currentScenario.items || currentScenario.items.length === 0)) {
            onUpdate(currentScenario.id, 'items', [{ id: Date.now(), name: 'Prestation 1', pv: currentScenario.pv, cost: currentScenario.cost }]);
        }
    }, [onUpdate]);

    const handleOpenCalculator = useCallback((itemId, field) => {
        setActiveCalculator({ itemId, field });
    }, []);

    // BOLT: Optimize - wrap expensive calculations in useMemo so they only run when scenario data actually changes
    const res = useMemo(() => calculateResults(s), [s]);

    // Handlers
    const handleChange = (field, val) => onUpdate(s.id, field, val);

    const handleSmartChange = useCallback((field, value) => {
        const currentScenario = sRef.current;
        if (currentScenario.isDetailed) return; // Disable smart changes in detailed mode (values are derived)

        const val = parseFloat(value) || 0;

        if (currentScenario.mode === 'pv_cost') {
            if (field === 'pv') {
                const newMarginPercent = val !== 0 ? ((val - currentScenario.cost) / val) * 100 : 0;
                onUpdate(currentScenario.id, 'marginPercent', newMarginPercent);
            } else if (field === 'cost') {
                const newMarginPercent = currentScenario.pv !== 0 ? ((currentScenario.pv - val) / currentScenario.pv) * 100 : 0;
                onUpdate(currentScenario.id, 'marginPercent', newMarginPercent);
            }
        }
        handleChange(field, value);
    }, [onUpdate]);

    return (
        <div
            ref={cardRef}
            className="scenario-card bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden relative"
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
                            aria-label={`Nom du scénario ${index + 1}`}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={s.mode}
                            onChange={(e) => handleChange('mode', e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
                            aria-label={`Mode de calcul pour ${s.name}`}
                            title="Choisissez quelles variables vous saisissez — la troisième est calculée automatiquement"
                        >
                            <option value="pv_cost" title="Saisissez le Prix de Vente et le Coût → la marge est calculée">PV & Coût</option>
                            <option value="cost_percent" title="Saisissez le Coût et la Marge cible (%) → le Prix de Vente est calculé">Marge & Coût</option>
                            <option value="pv_percent" title="Saisissez le Prix de Vente et la Marge cible (%) → le Coût est calculé">Marge & PV</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} aria-hidden="true" />
                    </div>
                    <div className="flex items-center print-hidden">
                        <button
                            onClick={handlePrint}
                            className="outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Exporter en PDF / Imprimer ce scénario"
                            aria-label="Exporter en PDF"
                        >
                            <Download size={18} />
                        </button>
                        <button
                            onClick={() => onDuplicate(s.id)}
                            className="outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Dupliquer ce scénario"
                            aria-label="Dupliquer ce scénario"
                        >
                            <Copy size={18} />
                        </button>
                        <ConfirmButton
                            onConfirm={() => onRemove(s.id)}
                            icon={Trash2}
                            label="Supprimer ce scénario"
                            message="Supprimer ?"
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            activeClassName="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600"
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-8 space-y-8">
                <div className="space-y-4">
                    {(s.mode === 'cost_percent' || s.mode === 'pv_percent') && (
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                    <PieChart size={18} aria-hidden="true" />
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
                                    onFocus={(e) => e.target.select()}
                                    className="w-20 px-3 py-1.5 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none text-right font-bold text-indigo-700"
                                    placeholder="0"
                                    aria-label="Marge Cible Globale"
                                />
                                <span className="font-bold text-indigo-400">%</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lignes du projet</h4>
                            <button onClick={addItem} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-2 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none print-hidden">
                                <Plus size={14} /> Ajouter une ligne
                            </button>
                        </div>
                        <ScenarioTable 
                            items={s.items}
                            mode={s.mode}
                            onUpdateItem={handleUpdateItem}
                            onRemoveItem={handleRemoveItem}
                            onOpenCalculator={handleOpenCalculator}
                            onAddItem={addItem}
                            results={res}
                        />
                    </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                <Percent size={18} aria-hidden="true" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm">Remise Commerciale</h4>
                                <p className="text-xs text-amber-600/80">Réduction appliquée sur le total HT</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={s.discount || ''}
                                onChange={(e) => onUpdate(s.id, 'discount', e.target.value)}
                                onFocus={(e) => e.target.select()}
                                placeholder="0"
                                className="w-24 px-3 py-1.5 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none text-right font-bold text-amber-700 bg-white"
                                aria-label="Montant de la remise"
                            />
                            <div className="flex bg-white rounded-lg border border-amber-200 p-0.5 shadow-sm">
                                <button
                                    onClick={() => onUpdate(s.id, 'discountMode', 'percent')}
                                    className={`outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${(!s.discountMode || s.discountMode === 'percent') ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-400 hover:bg-amber-50'}`}
                                    aria-label="Remise en pourcentage"
                                >
                                    %
                                </button>
                                <button
                                    onClick={() => onUpdate(s.id, 'discountMode', 'euro')}
                                    className={`outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${s.discountMode === 'euro' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-400 hover:bg-amber-50'}`}
                                    aria-label="Remise en euros"
                                >
                                    €
                                </button>
                            </div>
                        </div>
                    </div>

                <ProfitabilityBar
                    pv={res.pv}
                    cost={res.cost}
                    is={res.is}
                    netProfit={res.netProfit}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ResultCard
                            title="Prix Vente HT"
                            value={
                                res.discountAmount > 0 ? (
                                    <span className="flex flex-col items-start">
                                        <span className="text-xs line-through text-slate-400 font-medium">
                                            {FORMATTER.format(res.basePv)}
                                        </span>
                                        <span>{FORMATTER.format(res.pv)}</span>
                                    </span>
                                ) : (
                                    FORMATTER.format(res.pv)
                                )
                            }
                            type="neutral"
                        />
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg w-fit print-hidden">
                                <input
                                    type="checkbox"
                                    id={`no-vat-${s.id}`}
                                    checked={s.noVat || false}
                                    onChange={(e) => onUpdate(s.id, 'noVat', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`no-vat-${s.id}`} className="text-[10px] font-bold text-slate-600 uppercase">
                                    Non assujetti TVA
                                </label>
                            </div>
                            <ResultCard
                                title={
                                    <div className="flex items-center gap-1 -mt-1 -ml-1">
                                        <span>TVA</span>
                                        {!s.noVat ? (
                                            <select
                                                value={s.tvaRate !== undefined ? s.tvaRate : TAX_CONFIG.TVA_STANDARD}
                                                onChange={(e) => onUpdate(s.id, 'tvaRate', parseFloat(e.target.value))}
                                                className="appearance-none bg-transparent hover:bg-slate-100 text-slate-500 font-black focus:ring-2 focus:ring-indigo-500 rounded px-1 py-0.5 outline-none cursor-pointer"
                                                aria-label={`Taux de TVA pour ${s.name}`}
                                            >
                                                <option value={0}>0%</option>
                                                <option value={0.055}>5.5%</option>
                                                <option value={0.10}>10%</option>
                                                <option value={0.20}>20%</option>
                                            </select>
                                        ) : (
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded ml-1">0%</span>
                                        )}
                                    </div>
                                }
                                value={FORMATTER.format(res.tva)}
                                type="neutral"
                            />
                        </div>
                        <ResultCard
                            title={s.noVat ? "Prix Total" : "TTC Client"}
                            value={FORMATTER.format(res.ttc)}
                            type="primary"
                        />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <PriceBreakdown
                            cost={res.cost}
                            margin={res.marginEuro}
                            tva={res.tva}
                        />
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Détails</p>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className="text-slate-500 font-medium">Marge Brute Cible (HT)</span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={res.marginEuro.toFixed(0)}
                                    onChange={(e) => updateGlobalMarginEuro(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-24 px-2 py-1 text-right font-bold text-slate-700 bg-white border border-slate-200 rounded-md hover:border-indigo-300 focus:border-indigo-500 outline-none"
                                    aria-label="Objectif de Marge Brute en Euros"
                                    title="Modifiez pour recalculer automatiquement les prix ou les coûts"
                                />
                                <span className="text-slate-500 font-bold">€</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className="text-slate-500 font-medium">Bénéfice Net (Après IS)</span>
                            <span className={`font-bold ${res.netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                {res.netProfit >= 0 ? '+' : ''}{FORMATTER.format(res.netProfit)}
                            </span>
                        </div>
                    </div>

                    {/* Indicateur de Santé de la Marge globale */}
                    <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Santé de la marge globale :</span>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${(res.marginPercent * 100) >= 40 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                    (res.marginPercent * 100) >= 20 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                        'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                    }`}
                                aria-hidden="true"
                            />
                            <span className={`font-bold ${(res.marginPercent * 100) >= 40 ? 'text-emerald-700' :
                                (res.marginPercent * 100) >= 20 ? 'text-amber-700' :
                                    'text-red-700'
                                }`}>
                                {(res.marginPercent * 100) >= 40 ? 'Saine (≥ 40%)' :
                                    (res.marginPercent * 100) >= 20 ? 'Moyenne (20-40%)' :
                                        'Critique (< 20%)'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-1.5 text-[10px] text-amber-600/80 pt-1">
                        <Info size={11} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>IS estimé par scénario — non consolidé au niveau de l'exercice fiscal.</span>
                    </div>
                </div>
            </div>
            {/* TJM Calculator Modal/Overlay should be absolute or fixed to the item */}
            {activeCalculator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <TJMCalculator
                            initialValue={s.items.find(i => i.id === activeCalculator.itemId)?.[activeCalculator.field] || 0}
                            mode={activeCalculator.field === 'cost' ? 'cost' : 'price'}
                            onApply={(val) => {
                                handleUpdateItem(activeCalculator.itemId, activeCalculator.field, val);
                                setActiveCalculator(null);
                            }}
                            onClose={() => setActiveCalculator(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

export default ScenarioCard;
