import React, { memo, useState } from 'react';
import { Calculator, Plus, BarChart2, Eye, EyeOff, Share2, Check } from 'lucide-react';

// BOLT: Optimize - use memo to prevent re-renders when parent renders but props haven't changed.
const Header = memo(({ onAddScenario, onToggleComparison, isClientMode, setIsClientMode, scenarios }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        try {
            // Serialize scenarios state to base64
            const data = btoa(unescape(encodeURIComponent(JSON.stringify(scenarios))));
            const url = new URL(window.location.href);
            url.searchParams.set('data', data);

            await navigator.clipboard.writeText(url.toString());

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard', err);
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                        <Calculator className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                            Mark<span className="text-indigo-600">Up</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            Simulateur de Rentabilité
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsClientMode(!isClientMode)}
                        aria-label={isClientMode ? "Désactiver le mode présentation" : "Activer le mode présentation"}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            isClientMode
                                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                        }`}
                        title={isClientMode ? "Masquer les marges (Mode Client Activé)" : "Afficher les marges"}
                    >
                        {isClientMode ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                        <span className="hidden sm:inline">Mode Client</span>
                    </button>

                    <button
                        onClick={onToggleComparison}
                        aria-label="Comparer les scénarios"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                    >
                        <BarChart2 size={20} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Comparer</span>
                    </button>

                    <button
                        onClick={handleShare}
                        aria-label="Partager la simulation"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                        title="Copier le lien de partage"
                    >
                        {isCopied ? <Check size={20} strokeWidth={2.5} className="text-emerald-500" /> : <Share2 size={20} strokeWidth={2.5} />}
                        <span className="hidden sm:inline">{isCopied ? "Copié !" : "Partager"}</span>
                    </button>

                    <button
                        onClick={onAddScenario}
                        aria-label="Nouveau Scénario"
                        className="group flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-indigo-200 active:scale-95"
                    >
                        <Plus size={18} className="transition-transform group-hover:rotate-90" strokeWidth={2.5} />
                        <span className="hidden sm:inline">Nouveau Scénario</span>
                    </button>
                </div>
            </div>
        </header>
    );
});

// Optimisation: React.memo prevents unnecessary re-renders when parent state updates
export default memo(Header);
