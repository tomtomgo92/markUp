import React from 'react';
import { Settings2, Building2, Info } from 'lucide-react';

const Footer = () => {
    return (
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
    );
};

export default Footer;
