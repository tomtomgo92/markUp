import React, { memo } from 'react';
import { FORMATTER, PERCENT_FORMATTER } from '../utils/finance';
import './ProfitabilityBar.css';

const ProfitabilityBar = memo(({ pv, cost, is, netProfit }) => {
    if (!pv || pv <= 0) return null;

    const isLoss = netProfit < 0;

    if (isLoss) {
        return (
            <div className="profitability-bar profitability-bar--loss">
                <div className="profitability-bar__loss-head">
                    <span>Marge Négative (Déficitaire)</span>
                    <span>{FORMATTER.format(netProfit)}</span>
                </div>
                <div className="profitability-bar__loss-track">
                    <div className="profitability-bar__loss-fill" />
                </div>
                <p className="profitability-bar__loss-hint">Le coût dépasse le prix de vente.</p>
            </div>
        );
    }

    const costPct = Math.min(100, Math.max(0, (cost / pv) * 100));
    const taxPct = Math.min(100, Math.max(0, (is / pv) * 100));
    const netPct = Math.min(100, Math.max(0, (netProfit / pv) * 100));

    return (
        <div className="profitability-bar">
            <h4 className="profitability-bar__heading">Répartition du Chiffre d'Affaires</h4>

            <div className="profitability-bar__track">
                <div
                    style={{ width: `${costPct}%` }}
                    className="profitability-bar__segment profitability-bar__segment--cost"
                    title={`Coûts: ${FORMATTER.format(cost)}`}
                />

                {taxPct > 0 && (
                    <div
                        style={{ width: `${taxPct}%` }}
                        className="profitability-bar__segment profitability-bar__segment--tax"
                        title={`Impôts (IS): ${FORMATTER.format(is)}`}
                    />
                )}

                <div
                    style={{ width: `${netPct}%` }}
                    className="profitability-bar__segment profitability-bar__segment--profit"
                    title={`Bénéfice Net: ${FORMATTER.format(netProfit)}`}
                />
            </div>

            <div className="profitability-bar__legend">
                <div className="profitability-bar__legend-item">
                    <div className="profitability-bar__legend-row">
                        <div className="profitability-bar__dot profitability-bar__dot--cost" />
                        <span className="profitability-bar__legend-label">Coûts</span>
                    </div>
                    <div className="profitability-bar__legend-value">
                        {PERCENT_FORMATTER.format(costPct / 100)} <span className="profitability-bar__legend-amount">({FORMATTER.format(cost)})</span>
                    </div>
                </div>

                {is > 0 && (
                    <div className="profitability-bar__legend-item profitability-bar__legend-item--center">
                        <div className="profitability-bar__legend-row">
                            <div className="profitability-bar__dot profitability-bar__dot--tax" />
                            <span className="profitability-bar__legend-label">Impôts (IS)</span>
                        </div>
                        <div className="profitability-bar__legend-value">
                            {PERCENT_FORMATTER.format(taxPct / 100)} ({FORMATTER.format(is)})
                        </div>
                    </div>
                )}

                <div className="profitability-bar__legend-item profitability-bar__legend-item--end">
                    <div className="profitability-bar__legend-row">
                        <div className="profitability-bar__dot profitability-bar__dot--profit" />
                        <span className="profitability-bar__legend-label profitability-bar__legend-label--profit">Net Poche</span>
                    </div>
                    <div className="profitability-bar__legend-value profitability-bar__legend-value--profit">
                        {PERCENT_FORMATTER.format(netPct / 100)} <span className="profitability-bar__legend-amount">({FORMATTER.format(netProfit)})</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProfitabilityBar;
