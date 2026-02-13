import React, { useState } from 'react';
import {
    Calculator,
    TrendingUp,
    Plus,
    Building2,
    Settings2,
    Info,
} from 'lucide-react';
import Badge from './components/ui/Badge';
import ScenarioCard from './components/ScenarioCard';

const App = () => {
    const [scenarios, setScenarios] = useState([
        { id: 1, name: "Site E-commerce", pv: 0, cost: 0, marginPercent: 30, mode: 'pv_cost', isDetailed: false, items: [] }
    ]);

    const addScenario = () => {
        setScenarios([...scenarios, {
            id: Date.now(),
            name: "Nouveau Projet",
            pv: 0,
            cost: 0,
            marginPercent: 30,
            mode: 'pv_cost',
            isDetailed: false,
            items: []
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
