import React, { memo, useState } from 'react';
import { Calculator, Plus, BarChart2, Share2, Check } from 'lucide-react';
import { Button } from '@thatmuch/designsystem';
import './Header.css';

const Header = ({ onAddScenario, onToggleComparison, getScenarios }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        try {
            const payload = { v: 1, data: getScenarios() };
            const json = JSON.stringify(payload);
            const bytes = new TextEncoder().encode(json);
            const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
            const data = btoa(binary);

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
        <header className="app-header">
            <div className="container app-header__inner">
                <div className="app-header__brand">
                    <div className="app-header__logo">
                        <Calculator className="app-header__logo-icon" size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="app-header__title">
                            Mark<span className="app-header__title-accent">Up</span>
                        </h1>
                        <p className="app-header__subtitle">
                            Simulateur de Rentabilité
                        </p>
                    </div>
                </div>

                <div className="app-header__actions">
                    <Button
                        type="button"
                        variant="white"
                        size="sm"
                        icon={<BarChart2 size={20} strokeWidth={2.5} />}
                        onClick={onToggleComparison}
                        aria-label="Comparer les scénarios"
                    >
                        <span className="app-header__action-label">Comparer</span>
                    </Button>

                    <Button
                        type="button"
                        variant="white"
                        size="sm"
                        icon={isCopied ? <Check size={20} strokeWidth={2.5} className="app-header__copied-icon" /> : <Share2 size={20} strokeWidth={2.5} />}
                        onClick={handleShare}
                        aria-label="Partager la simulation"
                        title="Copier le lien de partage"
                    >
                        <span className="app-header__action-label">{isCopied ? "Copié !" : "Partager"}</span>
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        icon={<Plus size={18} strokeWidth={2.5} />}
                        onClick={onAddScenario}
                        aria-label="Nouveau Scénario"
                    >
                        <span className="app-header__action-label">Nouveau Scénario</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
