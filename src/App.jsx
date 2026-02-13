import React, { useState } from 'react';
import {
    Calculator,
    TrendingUp,
    Plus,
    Trash2,
    Euro,
    Building2,
    Settings2,
    Info,
    ChevronDown,
    PieChart,
    Wallet,
    ArrowRight
} from 'lucide-react';

// --- CONSTANTES & CONFIG ---
const TAX_CONFIG = {
    TVA_STANDARD: 0.20,
    IS_REDUIT: 0.15,
    IS_NORMAL: 0.25,
    SEUIL_IS: 42500
};

const FORMATTER = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
});

const PERCENT_FORMATTER = new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// --- COMPOSANTS UI ---

const Badge = ({ children, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        purple: "bg-purple-50 text-purple-700 border-purple-200",
        slate: "bg-slate-100 text-slate-700 border-slate-200"
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${colors[color] || colors.slate}`}>
            {children}
        </span>
    );
};

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

const ResultCard = ({ title, value, subtext, type = "neutral" }) => {
    const styles = {
        neutral: "bg-white border-slate-200",
        primary: "bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-transparent",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900"
    };

    return (
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between h-full ${styles[type]}`}>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${type === 'primary' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {title}
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${type === 'success' ? 'text-emerald-700' : ''}`}>
                    {value}
                </p>
            </div>
            {subtext && (
                <p className={`text-xs font-medium mt-2 ${type === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {subtext}
                </p>
            )}
        </div>
    );
};

// --- COMPOSANT SCÉNARIO ---

const ScenarioCard = ({ s, onUpdate, onRemove, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    // --- LOGIQUE METIER ---
    const calculateResults = () => {
        let pv = parseFloat(s.pv) || 0;
        let cost = parseFloat(s.cost) || 0;
        let marginPercent = parseFloat(s.marginPercent) || 0;

        if (s.mode === 'cost_percent') {
            pv = cost !== 0 ? cost / (1 - (marginPercent / 100)) : 0;
        } else if (s.mode === 'pv_percent') {
            cost = pv * (1 - (marginPercent / 100));
        }

        const marginEuro = pv - cost;
        // const currentPercent = pv !== 0 ? (marginEuro / pv) : 0; // Removed unused variable
        const tva = pv * TAX_CONFIG.TVA_STANDARD;

        // Calcul IS Progressif
        let is = 0;
        if (marginEuro > 0) {
            is = marginEuro <= TAX_CONFIG.SEUIL_IS
                ? marginEuro * TAX_CONFIG.IS_REDUIT
                : (TAX_CONFIG.SEUIL_IS * TAX_CONFIG.IS_REDUIT) + ((marginEuro - TAX_CONFIG.SEUIL_IS) * TAX_CONFIG.IS_NORMAL);
        }

        return {
            pv, cost, marginEuro,
            marginPercent: pv !== 0 ? (marginEuro / pv) : 0,
            tva, ttc: pv + tva, is,
            netProfit: marginEuro - is
        };
    };

    const res = calculateResults();

    // Handlers
    const handleChange = (field, val) => onUpdate(s.id, field, val);

    // Update logic for manual mode specific behavior
    const handleSmartChange = (field, value) => {
        const val = parseFloat(value) || 0;

        // Si on est en mode "Manuel" (pv_cost) et qu'on change PV ou Cost, on recalcule le % pour l'affichage
        if (s.mode === 'pv_cost') {
            if (field === 'pv') {
                // On change PV, le coût reste fixe, le % s'ajuste
                const newMarginPercent = val !== 0 ? ((val - s.cost) / val) * 100 : 0;
                onUpdate(s.id, 'marginPercent', newMarginPercent); // Juste pour stocker, le rendu le recalculera de toute façon
            } else if (field === 'cost') {
                // On change Cost, le PV reste fixe, le % s'ajuste
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

                {/* SECTION INPUTS */}
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

// --- APP ---

const App = () => {
    const [scenarios, setScenarios] = useState([
        { id: 1, name: "Site E-commerce", pv: 4500, cost: 3600, marginPercent: 20, mode: 'pv_cost' }
    ]);

    const addScenario = () => {
        setScenarios([...scenarios, {
            id: Date.now(),
            name: "Nouveau Projet",
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
        setScenarios(scenarios.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                            <Calculator className="text-white" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                                Financia<span className="text-indigo-600">Pro</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                Simulateur de Rentabilité
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={addScenario}
                        className="group flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-indigo-200 active:scale-95"
                    >
                        <Plus size={18} className="transition-transform group-hover:rotate-90" strokeWidth={2.5} />
                        <span className="hidden sm:inline">Nouveau Scénario</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* Hero Section / Intro */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" strokeWidth={2.5} />
                            Tableau de Bord
                        </h2>
                        <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
                            Analysez la rentabilité de vos projets en temps réel. Comparez différents scénarios de pricing,
                            ajustez vos marges et visualisez l'impact fiscal immédiatement.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge color="slate">Fiscalité 2024</Badge>
                        <Badge color="blue">Mode Expert</Badge>
                    </div>
                </div>

                {/* Scenarios Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {scenarios.map((s, idx) => (
                        <ScenarioCard
                            key={s.id}
                            s={s}
                            index={idx}
                            onUpdate={updateScenario}
                            onRemove={removeScenario}
                        />
                    ))}

                    {/* Empty State / Add New Card Shortcut */}
                    <button
                        onClick={addScenario}
                        className="group h-[300px] rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-600"
                    >
                        <div className="p-4 rounded-full bg-slate-50 group-hover:bg-indigo-100 transition-colors">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold text-sm">Ajouter une comparaison</span>
                    </button>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Legend 1 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Settings2 size={20} />
                                <h4 className="font-bold text-sm uppercase">Configuration Intelligente</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Le système ajuste automatiquement les variables manquantes. Si vous fixez la marge, le prix de vente s'adapte.
                                Si vous fixez le prix, la marge est recalculée.
                            </p>
                        </div>

                        {/* Legend 2 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <Building2 size={20} />
                                <h4 className="font-bold text-sm uppercase">Règles Fiscales IS</h4>
                            </div>
                            <ul className="text-xs text-slate-500 space-y-1">
                                <li className="flex justify-between border-b border-slate-100 pb-1">
                                    <span>Taux réduit (15%)</span>
                                    <span className="font-medium">jusqu'à 42 500€</span>
                                </li>
                                <li className="flex justify-between pt-1">
                                    <span>Taux normal (25%)</span>
                                    <span className="font-medium">au-delà de 42 500€</span>
                                </li>
                            </ul>
                        </div>

                        {/* Legend 3 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Info size={20} />
                                <h4 className="font-bold text-sm uppercase">À propos</h4>
                            </div>
                            <p className="text-xs text-slate-500">
                                Développé pour simplifier la gestion financière des freelances et TPE/PME.
                                Données non stockées hors du navigateur.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 mt-10 pt-6 flex justify-center">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            © 2024 FinanciaPro — Propulsé par React & Tailwind
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;