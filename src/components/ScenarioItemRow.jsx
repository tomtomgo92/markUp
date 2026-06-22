import "./ScenarioItemRow.css";

import { Calculator, Trash2 } from "lucide-react";
import React, { memo } from "react";
import { costFromPv, pvFromCost } from "../utils/finance";

import { Button } from "@thatmuch/designsystem";
import ConfirmButton from "./ui/ConfirmButton";

const ScenarioItemRow = memo(
  ({ item, index, mode, onUpdate, onRemove, onOpenCalculator, onAddItem }) => {
    const itemMargin =
      (parseFloat(item.pv) || 0) - (parseFloat(item.cost) || 0);

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onAddItem();
      }
    };
    const itemMarginPercent = parseFloat(item.pv)
      ? (itemMargin / parseFloat(item.pv)) * 100
      : 0;

    const marginHealth =
      itemMarginPercent >= 40
        ? "good"
        : itemMarginPercent >= 20
          ? "mid"
          : "low";

    const handleMarginPercentChange = (e) => {
      const val = parseFloat(e.target.value) || 0;
      if (mode === "cost_percent") {
        onUpdate(
          item.id,
          "pv",
          String(pvFromCost(parseFloat(item.cost) || 0, val)),
        );
      } else if (mode === "pv_percent") {
        onUpdate(
          item.id,
          "cost",
          String(costFromPv(parseFloat(item.pv) || 0, val)),
        );
      }
    };

    return (
      <tr className="scenario-row">
        <td className="scenario-row__index">{index + 1}</td>
        <td>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(item.id, "name", e.target.value)}
            onKeyDown={handleKeyDown}
            className="scenario-row__input scenario-row__input--name"
            placeholder="Nom..."
            aria-label={`Nom de la ligne ${index + 1}`}
          />
        </td>
        <td>
          <div className="scenario-row__cell">
            <div className="scenario-row__field">
              <input
                type="number"
                value={item.cost}
                disabled={mode === "pv_percent"}
                onChange={(e) => onUpdate(item.id, "cost", e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => e.target.select()}
                className="scenario-row__input scenario-row__input--amount"
                placeholder="0"
                aria-label={`Coût de la ligne ${item.name || index + 1}`}
              />
              <span className="scenario-row__suffix">€</span>
            </div>
            {onOpenCalculator && mode !== "pv_percent" && (
              <Button
                type="button"
                variant="white"
                size="sm"
                iconOnly
                className="scenario-row__calc-btn print-hidden"
                onClick={() => onOpenCalculator(item.id, "cost")}
                title="Calculer au CJM"
                aria-label="Ouvrir calculateur CJM"
                icon={<Calculator size={14} />}
              />
            )}
          </div>
        </td>
        <td>
          <div className="scenario-row__cell">
            <div className="scenario-row__field">
              <input
                type="number"
                value={item.pv}
                disabled={mode === "cost_percent"}
                onChange={(e) => onUpdate(item.id, "pv", e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => e.target.select()}
                className="scenario-row__input scenario-row__input--amount"
                placeholder="0"
                aria-label={`Prix de vente de ${item.name || index + 1}`}
              />
              <span className="scenario-row__suffix">€</span>
            </div>
            {onOpenCalculator && mode !== "cost_percent" && (
              <Button
                type="button"
                variant="white"
                size="sm"
                iconOnly
                className="scenario-row__calc-btn print-hidden"
                onClick={() => onOpenCalculator(item.id, "pv")}
                title="Calculer au TJM"
                aria-label="Ouvrir calculateurs TJM"
                icon={<Calculator size={14} />}
              />
            )}
          </div>
        </td>
        <td className="scenario-row__margin-cell">
          <div className="scenario-row__margin">
            <span
              className={`scenario-row__margin-value scenario-row__margin-value--${itemMargin >= 0 ? "positive" : "negative"}`}
            >
              {itemMargin.toFixed(0)}€
            </span>
            <div className="scenario-row__margin-pct">
              <div
                className={`scenario-row__health-dot scenario-row__health-dot--${marginHealth}`}
                title={`Santé de la marge: ${marginHealth === "good" ? "Excellente" : marginHealth === "mid" ? "Moyenne" : "Critique"}`}
                aria-hidden="true"
              />
              {mode === "cost_percent" || mode === "pv_percent" ? (
                <span className="scenario-row__pct-input-wrap">
                  <input
                    type="number"
                    value={itemMarginPercent.toFixed(1)}
                    onChange={handleMarginPercentChange}
                    onFocus={(e) => e.target.select()}
                    className="scenario-row__input scenario-row__input--pct"
                    aria-label={`Pourcentage de marge de ${item.name || "la ligne"}`}
                  />
                  <span className="scenario-row__pct-suffix">%</span>
                </span>
              ) : (
                <span className="scenario-row__pct-static">
                  {itemMarginPercent.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="scenario-row__actions print-hidden">
          <ConfirmButton
            onConfirm={() => onRemove(item.id)}
            label={`Supprimer la ligne ${item.name || "sans nom"}`}
            message="Suppr ?"
            size={14}
          />
        </td>
      </tr>
    );
  },
);

export default ScenarioItemRow;
