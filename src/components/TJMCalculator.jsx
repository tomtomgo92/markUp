import "./TJMCalculator.css";

import { Button, Input } from "@thatmuch/designsystem";
import { Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const TJMCalculator = ({
  initialValue = 0,
  onApply,
  onClose,
  mode = "price",
}) => {
  const [tjm, setTjm] = useState(500);
  const [days, setDays] = useState(1);
  const ref = useRef(null);

  const total = tjm * days;

  const label = mode === "cost" ? "CJM" : "TJM";
  const title = mode === "cost" ? "Calcul CJM" : "Calcul TJM";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApply(total);
    }
  };

  return (
    <div ref={ref} className="tjm-calculator">
      <div className="tjm-calculator__head">
        <h5 className="tjm-calculator__title">{title}</h5>
        <Button
          type="button"
          variant="white"
          size="sm"
          icon={<X size={16} aria-hidden="true" />}
          iconOnly
          onClick={onClose}
          aria-label={`Fermer le calculateur ${mode === "cost" ? "CJM" : "TJM"}`}
        />
      </div>

      <div className="tjm-calculator__fields">
        <Input
          type="number"
          label={`${label} (€/j)`}
          value={tjm}
          onChange={(e) => setTjm(parseFloat(e.target.value) || 0)}
          onKeyDown={handleEnter}
          onFocus={(e) => e.target.select()}
          placeholder="ex: 500"
          autoFocus
        />
        <Input
          type="number"
          label="Jours"
          value={days}
          onChange={(e) => setDays(parseFloat(e.target.value) || 0)}
          onKeyDown={handleEnter}
          onFocus={(e) => e.target.select()}
          placeholder="ex: 3"
        />
      </div>

      <div className="tjm-calculator__footer">
        <div className="tjm-calculator__total">
          <span className="tjm-calculator__total-label">Total</span>
          <span className="tjm-calculator__total-value">{total}€</span>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={<Check size={16} />}
          onClick={() => onApply(total)}
        >
          Appliquer
        </Button>
      </div>
    </div>
  );
};

export default TJMCalculator;
