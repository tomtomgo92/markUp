import React from 'react';
import { Settings2, Info } from 'lucide-react';
import './Footer.css';

const Footer = React.memo(() => {
    return (
        <footer className="app-footer">
            <div className="container app-footer__inner">
                <div className="app-footer__grid">
                    <div className="app-footer__col">
                        <div className="app-footer__heading app-footer__heading--accent">
                            <Settings2 size={20} />
                            <h4>Configuration Intelligente</h4>
                        </div>
                        <p className="app-footer__text">
                            Le système ajuste automatiquement les variables manquantes. Si vous fixez la marge, le prix de vente s'adapte.
                            Si vous fixez le prix, la marge est recalculée.
                        </p>
                    </div>

                    <div className="app-footer__col">
                        <div className="app-footer__heading">
                            <Info size={20} />
                            <h4>À propos</h4>
                        </div>
                        <p className="app-footer__text">
                            Développé pour simplifier la gestion financière des freelances et TPE/PME.
                            Données non stockées hors du navigateur.
                        </p>
                    </div>
                </div>

                <div className="app-footer__bottom">
                    <p className="app-footer__copyright">
                        © {new Date().getFullYear()} MarkUp — Propulsé par <a href="https://thatmuch.fr" target="_blank" rel="noopener noreferrer">THATMUCH</a>
                    </p>
                </div>
            </div>
        </footer>
    );
});

export default Footer;
