import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const ConfirmButton = ({
    onConfirm,
    icon: Icon = Trash2,
    label,
    message = "Confirmer ?",
    size = 18,
    className = "",
    activeClassName = "bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-md"
}) => {
    const [status, setStatus] = useState('idle');

    const handleClick = (e) => {
        e.stopPropagation();
        if (status === 'confirming') {
            onConfirm();
            setStatus('idle');
        } else {
            setStatus('confirming');
        }
    };

    return (
        <button
            onClick={handleClick}
            onBlur={() => setStatus('idle')}
            className={`transition-all duration-200 flex items-center justify-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                status === 'confirming' ? activeClassName : className
            }`}
            aria-label={status === 'confirming' ? message : label}
            title={status === 'confirming' ? message : label}
            type="button"
        >
            {status === 'confirming' ? (
                 <span className="whitespace-nowrap">{message}</span>
            ) : (
                <Icon size={size} aria-hidden="true" />
            )}
        </button>
    );
};

export default ConfirmButton;
