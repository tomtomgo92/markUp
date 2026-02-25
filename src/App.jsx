import React, { useState, useCallback } from 'react';
import {
    TrendingUp,
    Plus,
} from 'lucide-react';
import Badge from './components/ui/Badge';
import ScenarioCard from './components/ScenarioCard';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
    const [scenarios, setScenarios] = useState([
        { id: 1, name: "Scénario 1", pv: 0, cost: 0, marginPercent: 30, mode: 'pv_cost', isDetailed: false, items: [] }
    ]);

    // BOLT: Optimize - use useCallback to maintain stable function reference
    // This prevents ScenarioCard from re-rendering when other scenarios change.
    const addScenario = useCallback(() => {
        setScenarios((prev) => [...prev, {
            id: Date.now(),
            name: `Scénario ${prev.length + 1}`,
            pv: 0,
            cost: 0,
            marginPercent: 30,
            mode: 'pv_cost',
            isDetailed: false,
            items: []
        }]);
    }, []);

    // BOLT: Optimize - use useCallback to maintain stable function reference
    const removeScenario = useCallback((id) => {
        setScenarios((prev) => {
            if (prev.length > 1) {
                return prev.filter((s) => s.id !== id);
            }
            return prev;
        });
    }, []);

    // BOLT: Optimize - use useCallback to maintain stable function reference
    const updateScenario = useCallback((id, field, value) => {
        setScenarios((prev) => prev.map((s) => {
            if (s.id !== id) return s;
            // Support batch updates if field is an object
            if (typeof field === 'object') {
                return { ...s, ...field };
            }
            return { ...s, [field]: value };
        }));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            <Header onAddScenario={addScenario} />

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
                        className="group h-[300px] rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 outline-none"
                    >
                        <div className="p-4 rounded-full bg-slate-50 group-hover:bg-indigo-100 transition-colors">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold text-sm">Ajouter une comparaison</span>
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default App;
