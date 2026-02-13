import React, { useState } from 'react';
import {
    Calculator,
    TrendingUp,
    Plus,
    Trash2,
    Euro,
    FileText,
    Building2,
    Settings2,
    Info
} from 'lucide-react';

// --- CONFIGURATION FISCALE 2024/2025 ---
const TAX_CONFIG = {
    TVA_STANDARD: 0.20,
    IS_REDUIT: 0.15,
    IS_NORMAL: 0.25,
    SEUIL_IS: 42500
};

const App = () => {
    // Scénarios de marge basés sur les 3 cas de votre Excel
    const [scenarios, setScenarios] = useState([
        {
            id: 1,
            name: "Projet Principal",
            pv: 4500,
            cost: 3600,
            marginPercent: 20,
            mode: 'pv_cost'
        }
    ]);

    // --- LOGIQUE DE CALCUL DES MARGES ---
    const getResults = (s) => {
        let pv = s.pv;
        let cost = s.cost;
        let marginPercent = s.marginPercent;

        // Ajustement selon le mode de calcul choisi (Cas 1, 2 ou 3 de l'Excel)
        if (s.mode === 'cost_percent') {
            // Cas 2 : Coût et % connus -> Calcul du Prix de Vente
            pv = cost / (1 - (marginPercent / 100));
        } else if (s.mode === 'pv_percent') {
            // Cas 3 : PV et % connus -> Calcul du Coût
            cost = pv * (1 - (marginPercent / 100));
        }

        const marginEuro = pv - cost;
        const currentPercent = pv !== 0 ? (marginEuro / pv) * 100 : 0;
        const tva = pv * TAX_CONFIG.TVA_STANDARD;

        // Calcul de l'Impôt sur les Sociétés (IS) progressif
        let is = 0;
        if (marginEuro > 0) {
            is = marginEuro <= TAX_CONFIG.SEUIL_IS
                ? marginEuro * TAX_CONFIG.IS_REDUIT
                : (TAX_CONFIG.SEUIL_IS * TAX_CONFIG.IS_REDUIT) + ((marginEuro - TAX_CONFIG.SEUIL_IS) * TAX_CONFIG.IS_NORMAL);
        }

        return {
            pv,
            cost,
            marginEuro,
            marginPercent: currentPercent,
            tva,
            ttc: pv + tva,
            is,
            netProfit: marginEuro - is
        };
    };

    const addScenario = () => {
        setScenarios([...scenarios, {
            id: Date.now(),
            name: `Nouveau Projet`,
            pv: 1000,
            cost: 800,
            marginPercent: 20,
            mode: 'pv_cost'
        }]);
    };

    const removeScenario = (id) => {
        if (scenarios.length > 1) {
            setScenarios(scenarios.filter(s => s.id !== id));
        }
    };

    const updateScenario = (id, field, value) => {
        setScenarios(scenarios.map(s => {
            if (s.id === id) {
                const val = parseFloat(value) || 0;
                const updated = { ...s, [field]: val };

                // Mise à jour auto du % si on change PV ou Coût en mode manuel (Cas 1)
                if (s.mode === 'pv_cost' && (field === 'pv' || field === 'cost')) {
                    const currentPv = field === 'pv' ? val : s.pv;
                    const currentCost = field === 'cost' ? val : s.cost;
                    updated.marginPercent = currentPv !== 0 ? ((currentPv - currentCost) / currentPv) * 100 : 0;
                }
                return updated;
            }
            return s;
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 p-6 mb-8 shadow-sm">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                            <Calculator className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Financia<span className="text-blue-600">Pro</span></h1>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Calculateur de rentabilité projet</p>
                        </div>
                    </div>

                    <button
                        onClick={addScenario}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md active:scale-95"
                    >
                        <Plus size={18} /> Nouveau Cas
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <TrendingUp size={24} className="text-green-500" />
                        Analyse de Marge & Fiscalité
                    </h2>
                    <p className="text-slate-500 text-sm">Réplique fidèle des calculs de votre structure Excel.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {scenarios.map((s) => {
                        const res = getResults(s);
                        return (
                            <div key={s.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-400 transition-all duration-300">
                                {/* Sélecteur de Mode (Cas Excel) */}
                                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase">Config</span>
                                        <select
                                            className="bg-transparent text-xs font-bold rounded-md outline-none cursor-pointer text-slate-700"
                                            value={s.mode}
                                            onChange={(e) => updateScenario(s.id, 'mode', e.target.value)}
                                        >
                                            <option value="pv_cost">Mode 1 : PV + Coût connus</option>
                                            <option value="cost_percent">Mode 2 : Coût + % Marge connus</option>
                                            <option value="pv_percent">Mode 3 : PV + % Marge connus</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => removeScenario(s.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Entrées de données */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className={`space-y-1.5 transition-opacity ${s.mode === 'cost_percent' ? 'opacity-30 pointer-events-none' : ''}`}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Prix de Vente HT</label>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    disabled={s.mode === 'cost_percent'}
                                                    className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={res.pv.toFixed(2)}
                                                    onChange={(e) => updateScenario(s.id, 'pv', e.target.value)}
                                                />
                                                <Euro className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            </div>
                                        </div>

                                        <div className={`space-y-1.5 transition-opacity ${s.mode === 'pv_percent' ? 'opacity-30 pointer-events-none' : ''}`}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Coût HT</label>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    disabled={s.mode === 'pv_percent'}
                                                    className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={res.cost.toFixed(2)}
                                                    onChange={(e) => updateScenario(s.id, 'cost', e.target.value)}
                                                />
                                                <Euro className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            </div>
                                        </div>

                                        <div className={`space-y-1.5 transition-opacity ${s.mode === 'pv_cost' ? 'opacity-30 pointer-events-none' : ''}`}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">% de Marge</label>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    disabled={s.mode === 'pv_cost'}
                                                    className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={res.marginPercent.toFixed(2)}
                                                    onChange={(e) => updateScenario(s.id, 'marginPercent', e.target.value)}
                                                />
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-black">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Résultats Principaux */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg shadow-red-100">
                                            <p className="text-[10px] font-black uppercase opacity-70 mb-1">Marge Générée</p>
                                            <p className="text-3xl font-black">{res.marginEuro.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                                        </div>
                                        <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">% Marge Final</p>
                                            <p className="text-3xl font-black text-emerald-700">{res.marginPercent.toFixed(2)}%</p>
                                        </div>
                                    </div>

                                    {/* Détail Fiscal */}
                                    <div className="pt-6 border-t border-slate-100 space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">TVA (20%)</span>
                                                <span className="font-bold text-slate-600">+{res.tva.toFixed(2)}€</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">Impôt Société</span>
                                                <span className="font-bold text-orange-600">-{res.is.toFixed(2)}€</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">TTC Client</span>
                                                <span className="font-bold text-slate-700">{res.ttc.toFixed(2)}€</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 p-4 rounded-2xl flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                                Bénéfice Net Réel
                                            </span>
                                            <span className="text-2xl font-black text-white">
                                                {res.netProfit.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <footer className="max-w-6xl mx-auto mt-16 px-4 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                    <div className="flex gap-4 items-start">
                        <Settings2 size={24} className="text-blue-500 shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-700 uppercase italic">Modes de Calcul</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Utilisez le sélecteur en haut de chaque carte pour définir votre point de départ.
                                L'application calcule automatiquement la troisième variable pour garantir la cohérence financière.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <Info size={24} className="text-green-500 shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-700 uppercase italic">Fiscalité 2024/2025</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                TVA 20% appliquée sur le PV HT. Impôt sur les sociétés calculé avec le barème progressif français (15% jusqu'à 42 500€ de bénéfice, 25% au-delà).
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;