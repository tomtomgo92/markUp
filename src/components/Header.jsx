import React from 'react';
import { Calculator, Plus } from 'lucide-react';

const Header = ({ onAddScenario }) => {
    return (
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
                    onClick={onAddScenario}
                    className="group flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-indigo-200 active:scale-95"
                >
                    <Plus size={18} className="transition-transform group-hover:rotate-90" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Nouveau Scénario</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
