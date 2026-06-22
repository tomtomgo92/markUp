import React, { memo } from 'react';
import { Card } from '@thatmuch/designsystem';
import { FORMATTER, PERCENT_FORMATTER } from '../utils/finance';
import './PriceBreakdown.css';

const PriceBreakdown = memo(({ cost, margin, tva }) => {
    if (margin < 0) return null;

    const total = cost + margin + tva;

    if (!total || total <= 0) return null;

    const costPct = (cost / total) * 100;
    const marginPct = (margin / total) * 100;
    const tvaPct = (tva / total) * 100;

    const size = 120;
    const strokeWidth = 16;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const costOffset = 0;
    const marginOffset = -((costPct / 100) * circumference);
    const tvaOffset = -(((costPct + marginPct) / 100) * circumference);

    return (
        <Card className="price-breakdown">
            <h4 className="price-breakdown__heading">Structure du Prix TTC</h4>

            <div className="price-breakdown__chart">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="price-breakdown__svg">
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="var(--neutral-50)"
                        strokeWidth={strokeWidth}
                    />

                    {costPct > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="var(--neutral-100)"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${(costPct / 100) * circumference} ${circumference}`}
                            strokeDashoffset={costOffset}
                        />
                    )}

                    {marginPct > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="var(--status-success)"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${(marginPct / 100) * circumference} ${circumference}`}
                            strokeDashoffset={marginOffset}
                        />
                    )}

                    {tvaPct > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="var(--neutral-600)"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${(tvaPct / 100) * circumference} ${circumference}`}
                            strokeDashoffset={tvaOffset}
                        />
                    )}
                </svg>
                <div className="price-breakdown__total">
                    <span className="price-breakdown__total-label">Total</span>
                    <span className="price-breakdown__total-value">{FORMATTER.format(total)}</span>
                </div>
            </div>

            <div className="price-breakdown__legend">
                <div className="price-breakdown__legend-row">
                    <div className="price-breakdown__legend-label">
                        <div className="price-breakdown__dot price-breakdown__dot--cost" />
                        <span>Coûts</span>
                    </div>
                    <span className="price-breakdown__legend-pct">{PERCENT_FORMATTER.format(costPct / 100)}</span>
                </div>
                <div className="price-breakdown__legend-row">
                    <div className="price-breakdown__legend-label">
                        <div className="price-breakdown__dot price-breakdown__dot--margin" />
                        <span>Marge</span>
                    </div>
                    <span className="price-breakdown__legend-pct">{PERCENT_FORMATTER.format(marginPct / 100)}</span>
                </div>
                <div className="price-breakdown__legend-row">
                    <div className="price-breakdown__legend-label">
                        <div className="price-breakdown__dot price-breakdown__dot--tva" />
                        <span>TVA</span>
                    </div>
                    <span className="price-breakdown__legend-pct">{PERCENT_FORMATTER.format(tvaPct / 100)}</span>
                </div>
            </div>
        </Card>
    );
});

export default PriceBreakdown;
