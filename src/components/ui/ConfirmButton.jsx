import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@thatmuch/designsystem';
import './ConfirmButton.css';

const ConfirmButton = ({
    onConfirm,
    icon: Icon = Trash2,
    label,
    message = "Confirmer ?",
    size = 18,
    variant = "white",
    confirmVariant = "com",
}) => {
    const [status, setStatus] = useState('idle');
    const confirming = status === 'confirming';

    const handleClick = (e) => {
        e.stopPropagation();
        if (confirming) {
            onConfirm();
            setStatus('idle');
        } else {
            setStatus('confirming');
        }
    };

    return (
        <Button
            type="button"
            variant={confirming ? confirmVariant : variant}
            size="sm"
            iconOnly={!confirming}
            className="confirm-btn"
            onClick={handleClick}
            onBlur={() => setStatus('idle')}
            aria-label={confirming ? message : label}
            title={confirming ? message : label}
        >
            {confirming ? message : <Icon size={size} aria-hidden="true" />}
        </Button>
    );
};

export default ConfirmButton;
