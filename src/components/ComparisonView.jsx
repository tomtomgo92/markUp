import React, { useEffect, useMemo } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@thatmuch/designsystem';
import { calculateResults, FORMATTER, PERCENT_FORMATTER } from '../utils/finance';
import './ComparisonView.css';

const ComparisonView = ({ scenarios, onClose }) => {
    // 1. Calculate results for all scenarios
    // BOLT: Optimize - useMemo to prevent expensive calculateResults calls on every render
    const data = useMemo(() => scenarios.map(s => {
        const res = calculateResults(s);
        return {
            ...s,
            results: res
        };
    }), [scenarios]);

    // 2. Determine max PV to scale the chart
    // BOLT: Optimize - useMemo to prevent recalculating max on every render
    const maxPV = useMemo(() => Math.max(...data.map(d => d.results.pv), 1), [data]); // Avoid div by 0

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="comparison-view">
            <div className="comparison-view__backdrop" onClick={onClose}></div>

            <div className="comparison-view__modal">
                <div className="comparison-view__head">
                    <div>
                        <h2 className="comparison-view__title">
                            <TrendingUp className="comparison-view__title-icon" />
                            Comparateur de Scénarios
                        </h2>
                        <p className="comparison-view__subtitle">Visualisez la rentabilité comparée de vos options</p>
                    </div>
                    <Button
                        type="button"
                        variant="white"
                        size="sm"
                        iconOnly
                        onClick={onClose}
                        aria-label="Fermer le comparateur"
                    >
                        <X size={24} aria-hidden="true" />
                    </Button>
                </div>

                <div className="comparison-view__chart-area">
                    <div className="comparison-view__chart">
                        {data.map((item) => {
                            const { pv, cost, marginEuro, marginPercent } = item.results;
                            const heightPercent = (pv / maxPV) * 100;

                            const costHeight = pv > 0 ? (cost / pv) * 100 : 0;
                            const marginHeight = pv > 0 ? (marginEuro / pv) * 100 : 0;

                            const isLowMargin = marginPercent < 0.15;

                            return (
                                <div key={item.id} className="comparison-view__bar-col">
                                    <div className="comparison-view__bar-value">
                                        {FORMATTER.format(pv)}
                                    </div>

                                    <div
                                        className="comparison-view__bar-track"
                                        style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                    >
                                        <div
                                            className={`comparison-view__bar-segment comparison-view__bar-segment--margin ${isLowMargin ? 'comparison-view__bar-segment--low' : ''}`}
                                            style={{ height: `${marginHeight}%` }}
                                        >
                                            {marginHeight > 15 && (
                                                <span className="comparison-view__bar-label">Marge</span>
                                            )}
                                        </div>

                                        <div
                                            className="comparison-view__bar-segment comparison-view__bar-segment--cost"
                                            style={{ height: `${costHeight}%` }}
                                        >
                                            {costHeight > 15 && (
                                                <span className="comparison-view__bar-label comparison-view__bar-label--cost">Coût</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="comparison-view__bar-name-group">
                                        <div className="comparison-view__bar-name" title={item.name}>
                                            {item.name}
                                        </div>
                                        <div className="comparison-view__bar-pct-row">
                                            <span className={`comparison-view__bar-pct ${isLowMargin ? 'comparison-view__bar-pct--low' : ''}`}>
                                                {PERCENT_FORMATTER.format(marginPercent)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="comparison-view__bar-metrics">
                                        <div className="comparison-view__bar-metric">
                                            <span>Coût:</span>
                                            <span className="comparison-view__bar-metric-value">{FORMATTER.format(cost)}</span>
                                        </div>
                                        <div className="comparison-view__bar-metric comparison-view__bar-metric--net">
                                            <span>Net:</span>
                                            <span>{FORMATTER.format(marginEuro)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="comparison-view__legend">
                    <div className="comparison-view__legend-item">
                        <div className="comparison-view__legend-swatch comparison-view__legend-swatch--margin"></div>
                        <span>Marge Brute</span>
                    </div>
                    <div className="comparison-view__legend-item">
                        <div className="comparison-view__legend-swatch comparison-view__legend-swatch--cost"></div>
                        <span>Coûts (Achats/Presta)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonView;
