import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    TrendingUp,
    Plus,
} from 'lucide-react';
import ScenarioCard from './components/ScenarioCard';
import Header from './components/Header';
import Footer from './components/Footer';
import ComparisonView from './components/ComparisonView';
import './App.css';

const LS_KEY = 'markup_scenarios';

const decodeScenarios = (data) => {
    const binary = atob(data);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    // v0 compat: old URLs encoded raw arrays
    if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : null;
    // v1 schema: { v: 1, data: [] }
    if (parsed?.v === 1 && Array.isArray(parsed.data)) return parsed.data.length > 0 ? parsed.data : null;
    return null;
};

const getInitialScenarios = () => {
    // 1. URL takes priority
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const data = urlParams.get('data');
        if (data) {
            const parsed = decodeScenarios(data);
            if (parsed) return parsed;
        }
    } catch (error) {
        console.error("Failed to parse scenarios from URL", error);
    }

    // 2. Fall back to localStorage
    try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (error) {
        console.error("Failed to read localStorage", error);
    }

    // 3. Default
    return [{ id: 1, name: "Scénario 1", pv: 0, cost: 0, marginPercent: 30, mode: 'pv_cost', isDetailed: false, items: [] }];
};

const App = () => {
    // BOLT: Optimize - Use lazy initialization by passing function reference
    // Prevents expensive URL parsing and JSON decoding on every render
    const [scenarios, setScenarios] = useState(getInitialScenarios);
    const [showComparison, setShowComparison] = useState(false);

    // Auto-save to localStorage on every change
    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(scenarios));
        } catch (e) {
            console.warn('localStorage save failed', e);
        }
    }, [scenarios]);

    // Ref to maintain latest scenarios state without triggering re-renders in Header
    const scenariosRef = useRef(scenarios);
    scenariosRef.current = scenarios;

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

    const duplicateScenario = useCallback((id) => {
        setScenarios((prev) => {
            const scenarioToCopy = prev.find(s => s.id === id);
            if (!scenarioToCopy) return prev;

            const newScenario = {
                ...JSON.parse(JSON.stringify(scenarioToCopy)), // Deep copy for items array
                id: Date.now(),
                name: `Copie de ${scenarioToCopy.name}`
            };
            return [...prev, newScenario];
        });
    }, []);

    // BOLT: Optimize - Prevent Header from re-rendering by using stable callbacks
    const handleToggleComparison = useCallback(() => setShowComparison(true), []);
    const getScenarios = useCallback(() => scenariosRef.current, []);

    return (
        <div className="app-shell">
            <div className="print-hidden">
                <Header
                    onAddScenario={addScenario}
                    onToggleComparison={handleToggleComparison}
                    getScenarios={getScenarios}
                />
            </div>

            {/* MAIN CONTENT */}
            <main className="container app-main">

                {/* Hero Section / Intro */}
                <div className="app-main__hero print-hidden">
                    <div className="app-main__hero-text">
                        <h2 className="app-main__hero-title">
                            <TrendingUp className="app-main__hero-icon" strokeWidth={2.5} />
                            Tableau de Bord
                        </h2>
                        <p className="app-main__hero-desc">
                            Analysez la rentabilité de vos projets en temps réel. Comparez différents scénarios de pricing,
                            ajustez vos marges et visualisez l'impact fiscal immédiatement.
                        </p>
                    </div>
                </div>

                {/* Scenarios Grid */}
                <div className="app-main__grid">
                    {scenarios.map((s, idx) => (
                        <ScenarioCard
                            key={s.id}
                            s={s}
                            index={idx}
                            onUpdate={updateScenario}
                            onRemove={removeScenario}
                            onDuplicate={duplicateScenario}
                        />
                    ))}

                    {/* Empty State / Add New Card Shortcut */}
                    <button
                        onClick={addScenario}
                        className="app-main__add-card print-hidden"
                    >
                        <div className="app-main__add-card-icon">
                            <Plus size={32} />
                        </div>
                        <span className="app-main__add-card-label">Ajouter une comparaison</span>
                    </button>
                </div>
            </main>

            <div className="print-hidden">
                <Footer />
            </div>

            {showComparison && (
                <ComparisonView
                    scenarios={scenarios}
                    onClose={() => setShowComparison(false)}
                />
            )}
        </div>
    );
};

export default App;
