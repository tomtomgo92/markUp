import React, { memo } from 'react';
import { Card, CardBody } from '@thatmuch/designsystem';
import './ResultCard.css';

const ResultCard = memo(({ title, value, subtext, type = "neutral" }) => {
    return (
        <Card className={`result-card result-card--${type}`}>
            <CardBody className="result-card__body">
                <p className="result-card__title">{title}</p>
                <div className="result-card__value">{value}</div>
                {subtext && <p className="result-card__subtext">{subtext}</p>}
            </CardBody>
        </Card>
    );
});

export default ResultCard;
