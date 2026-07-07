import "./ScenarioCard.css";

import { Button, Checkbox } from "@thatmuch/designsystem";
import {
  ChevronDown,
  Copy,
  Download,
  Globe,
  Percent,
  PieChart,
  Plus,
  Trash2,
} from "lucide-react";
import {
  FORMATTER,
  TAX_CONFIG,
  calculateResults,
  costFromPv,
  pvFromCost,
} from "../utils/finance";
import React, { memo, useCallback, useRef, useState } from "react";

import ConfirmButton from "./ui/ConfirmButton";
import PriceBreakdown from "./PriceBreakdown";
import ProfitabilityBar from "./ProfitabilityBar";
import ResultCard from "./ui/ResultCard";
import ScenarioTable from "./ScenarioTable";
import TJMCalculator from "./TJMCalculator";

// BOLT: Optimize - use memo to prevent re-renders when parent renders but props haven't changed.
// This is critical for list items where updating one item causes parent to re-render all items.
const ScenarioCard = memo(({ s, onUpdate, onRemove, onDuplicate, index }) => {
  // Stores { itemId, field } or null
  const [activeCalculator, setActiveCalculator] = useState(null);

  // BOLT: Optimize - Use useRef to keep track of the latest 's' prop without triggering re-renders in callbacks
  const sRef = useRef(s);
  sRef.current = s;

  const cardRef = useRef(null);

  const handlePrint = useCallback(() => {
    const card = cardRef.current;
    if (!card) {
      window.print();
      return;
    }
    document.body.classList.add("print-single");
    card.classList.add("is-printing");
    const cleanup = () => {
      document.body.classList.remove("print-single");
      card.classList.remove("is-printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }, []);

  // --- MANAGE ITEMS ---
  const addItem = useCallback(() => {
    const currentS = sRef.current;
    const newItems = [
      ...(currentS.items || []),
      {
        id: Date.now(),
        name: `Ligne ${(currentS.items?.length || 0) + 1}`,
        pv: 0,
        cost: 0,
      },
    ];
    onUpdate(currentS.id, "items", newItems);
  }, [onUpdate]);

  const handleUpdateItem = useCallback(
    (itemId, field, value) => {
      const currentScenario = sRef.current;
      const val = parseFloat(value) || 0;
      const newItems = currentScenario.items.map((item) => {
        if (item.id === itemId) {
          let updates = { [field]: value };

          // Auto-calculate logic based on mode
          if (currentScenario.mode === "cost_percent" && field === "cost") {
            const margin = parseFloat(currentScenario.marginPercent) || 0;
            updates.pv = String(pvFromCost(val, margin));
          } else if (currentScenario.mode === "pv_percent" && field === "pv") {
            const margin = parseFloat(currentScenario.marginPercent) || 0;
            updates.cost = String(costFromPv(val, margin));
          }

          return { ...item, ...updates };
        }
        return item;
      });
      onUpdate(currentScenario.id, "items", newItems);
    },
    [onUpdate],
  );

  const handleRemoveItem = useCallback(
    (itemId) => {
      const currentScenario = sRef.current;
      const newItems = currentScenario.items.filter(
        (item) => item.id !== itemId,
      );
      onUpdate(currentScenario.id, "items", newItems);
    },
    [onUpdate],
  );

  const updateGlobalMarginEuro = useCallback(
    (value) => {
      const currentS = sRef.current;
      const targetMarginEuro = parseFloat(value) || 0;

      const totalCost = currentS.items.reduce(
        (acc, item) => acc + (parseFloat(item.cost) || 0),
        0,
      );
      const totalPv = currentS.items.reduce(
        (acc, item) => acc + (parseFloat(item.pv) || 0),
        0,
      );

      const newItems = currentS.items.map((item) => {
        const cost = parseFloat(item.cost) || 0;
        const pv = parseFloat(item.pv) || 0;

        if (currentS.mode === "cost_percent" || currentS.mode === "pv_cost") {
          // Keep cost fixed, change PV
          let itemTargetMargin = 0;
          if (totalCost > 0) {
            itemTargetMargin = targetMarginEuro * (cost / totalCost);
          } else if (currentS.items.length > 0) {
            itemTargetMargin = targetMarginEuro / currentS.items.length;
          }
          const newPv = cost + itemTargetMargin;
          return { ...item, pv: newPv.toFixed(0) };
        } else if (currentS.mode === "pv_percent") {
          // Keep PV fixed, change Cost
          let itemTargetMargin = 0;
          if (totalPv > 0) {
            itemTargetMargin = targetMarginEuro * (pv / totalPv);
          } else if (currentS.items.length > 0) {
            itemTargetMargin = targetMarginEuro / currentS.items.length;
          }
          const newCost = pv - itemTargetMargin;
          return { ...item, cost: newCost.toFixed(0) };
        }
        return item;
      });

      onUpdate(currentS.id, "items", newItems);
    },
    [onUpdate],
  );

  const updateGlobalMargin = useCallback(
    (value) => {
      const currentS = sRef.current;
      const margin = parseFloat(value) || 0;
      const newItems = currentS.items.map((item) => {
        const cost = parseFloat(item.cost) || 0;
        const pv = parseFloat(item.pv) || 0;

        if (currentS.mode === "cost_percent") {
          return { ...item, pv: String(pvFromCost(cost, margin)) };
        } else if (currentS.mode === "pv_percent") {
          return { ...item, cost: String(costFromPv(pv, margin)) };
        }
        return item;
      });

      // Batch update: margin
      onUpdate(currentS.id, { marginPercent: value, items: newItems });
    },
    [onUpdate],
  );

  const handleOpenCalculator = useCallback((itemId, field) => {
    setActiveCalculator({ itemId, field });
  }, []);

  const res = calculateResults(s);

  // Handlers
  const handleChange = (field, val) => onUpdate(s.id, field, val);

  const marginHealth =
    res.marginPercent * 100 >= 40
      ? "good"
      : res.marginPercent * 100 >= 20
        ? "mid"
        : "low";

  return (
    <div ref={cardRef} className="scenario-card">
      {/* Header Carte */}
      <div className="scenario-card__head">
        <div className="scenario-card__title-group">
          <div className="scenario-card__index">{index + 1}</div>
          <input
            type="text"
            value={s.name}
            onChange={(e) => onUpdate(s.id, "name", e.target.value)}
            className="scenario-card__name-input"
            placeholder="Nom du scénario"
            aria-label={`Nom du scénario ${index + 1}`}
          />
        </div>

        <div className="scenario-card__head-actions">
          <div className="scenario-card__select-wrap">
            <select
              value={s.mode}
              onChange={(e) => handleChange("mode", e.target.value)}
              className="scenario-card__select"
              aria-label={`Mode de calcul pour ${s.name}`}
              title="Choisissez quelles variables vous saisissez — la troisième est calculée automatiquement"
            >
              <option
                value="pv_cost"
                title="Saisissez le Prix de Vente et le Coût → la marge est calculée"
              >
                PV & Coût
              </option>
              <option
                value="cost_percent"
                title="Saisissez le Coût et la Marge cible (%) → le Prix de Vente est calculé"
              >
                Marge & Coût
              </option>
              <option
                value="pv_percent"
                title="Saisissez le Prix de Vente et la Marge cible (%) → le Coût est calculé"
              >
                Marge & PV
              </option>
            </select>
            <ChevronDown
              className="scenario-card__select-icon"
              size={14}
              aria-hidden="true"
            />
          </div>
          <div className="scenario-card__icon-actions print-hidden">
            <Button
              type="button"
              variant="white"
              size="sm"
              iconOnly
              onClick={handlePrint}
              title="Exporter en PDF / Imprimer ce scénario"
              aria-label="Exporter en PDF"
              icon={<Download size={18} />}
            />
            <Button
              type="button"
              variant="white"
              size="sm"
              iconOnly
              onClick={() => onDuplicate(s.id)}
              title="Dupliquer ce scénario"
              aria-label="Dupliquer ce scénario"
              icon={<Copy size={18} />}
            />
            <ConfirmButton
              onConfirm={() => onRemove(s.id)}
              icon={<Trash2 size={18} />}
              label="Supprimer ce scénario"
              message="Supprimer ?"
            />
          </div>
        </div>
      </div>

      <div className="scenario-card__body">
        <div className="scenario-card__section">
          {(s.mode === "cost_percent" || s.mode === "pv_percent") && (
            <div className="scenario-card__callout scenario-card__callout--accent">
              <div className="scenario-card__callout-left">
                <div className="scenario-card__callout-icon">
                  <PieChart size={18} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="scenario-card__callout-title">
                    Marge Cible Globale
                  </h4>
                  <p className="scenario-card__callout-hint">
                    S'applique à toutes les lignes
                  </p>
                </div>
              </div>
              <div className="scenario-card__callout-control">
                <input
                  type="number"
                  value={s.marginPercent}
                  onChange={(e) => updateGlobalMargin(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="scenario-card__callout-input"
                  placeholder="0"
                  aria-label="Marge Cible Globale"
                />
                <span className="scenario-card__callout-unit">%</span>
              </div>
            </div>
          )}

          <div className="scenario-card__lines">
            <div className="scenario-card__lines-head">
              <h4 className="scenario-card__lines-title">Lignes du projet</h4>
              <Button
                onClick={addItem}
                variant="white"
                icon={<Plus size={14} />}
                className="scenario-card__add-line print-hidden"
              >
                Ajouter une ligne
              </Button>
            </div>
            <ScenarioTable
              items={s.items}
              mode={s.mode}
              noVat={s.noVat === true}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onOpenCalculator={handleOpenCalculator}
              onAddItem={addItem}
              results={res}
            />
          </div>
        </div>

        <div className="scenario-card__callout scenario-card__callout--warning">
          <div className="scenario-card__callout-left">
            <div className="scenario-card__callout-icon scenario-card__callout-icon--warning">
              <Percent size={18} aria-hidden="true" />
            </div>
            <div>
              <h4 className="scenario-card__callout-title scenario-card__callout-title--warning">
                Remise Commerciale
              </h4>
              <p className="scenario-card__callout-hint scenario-card__callout-hint--warning">
                Réduction appliquée sur le total HT
              </p>
            </div>
          </div>

          <div className="scenario-card__callout-control">
            <input
              type="number"
              value={s.discount || ""}
              onChange={(e) => onUpdate(s.id, "discount", e.target.value)}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              className="scenario-card__callout-input scenario-card__callout-input--warning"
              aria-label="Montant de la remise"
            />
            <div className="scenario-card__discount-toggle">
              <button
                onClick={() => onUpdate(s.id, "discountMode", "percent")}
                className={`scenario-card__discount-btn ${!s.discountMode || s.discountMode === "percent" ? "scenario-card__discount-btn--active" : ""}`}
                aria-label="Remise en pourcentage"
              >
                %
              </button>
              <button
                onClick={() => onUpdate(s.id, "discountMode", "euro")}
                className={`scenario-card__discount-btn ${s.discountMode === "euro" ? "scenario-card__discount-btn--active" : ""}`}
                aria-label="Remise en euros"
              >
                €
              </button>
            </div>
          </div>
        </div>

        <div className="scenario-card__callout scenario-card__callout--foreign">
          <div className="scenario-card__callout-left">
            <div className="scenario-card__callout-icon scenario-card__callout-icon--foreign">
              <Globe size={18} aria-hidden="true" />
            </div>
            <div>
              <h4 className="scenario-card__callout-title">
                Paiement à l'étranger
              </h4>
              <p className="scenario-card__callout-hint">
                Désactive la TVA (client hors UE / non assujetti)
              </p>
            </div>
          </div>

          <div className="scenario-card__callout-control">
            <button
              type="button"
              role="switch"
              aria-checked={s.noVat === true}
              onClick={() => onUpdate(s.id, "noVat", !s.noVat)}
              className={`scenario-card__vat-switch ${s.noVat ? "scenario-card__vat-switch--on" : ""}`}
              title="Activer pour facturer sans TVA (paiement à l'étranger)"
            >
              <span className="scenario-card__vat-switch-track">
                <span className="scenario-card__vat-switch-thumb" />
              </span>
              <span className="scenario-card__vat-switch-label">
                {s.noVat ? "Hors TVA" : "TVA 20%"}
              </span>
            </button>
          </div>
        </div>

        <ProfitabilityBar
          pv={res.pv}
          cost={res.cost}
          marginEuro={res.marginEuro}
        />

        {/* <div className="scenario-card__results">
                    <div className="scenario-card__results-main">
                        <ResultCard
                            title="Prix Vente HT"
                            value={
                                res.discountAmount > 0 ? (
                                    <span className="scenario-card__discounted-value">
                                        <span className="scenario-card__discounted-old">
                                            {FORMATTER.format(res.basePv)}
                                        </span>
                                        <span>{FORMATTER.format(res.pv)}</span>
                                    </span>
                                ) : (
                                    FORMATTER.format(res.pv)
                                )
                            }
                            type="neutral"
                        />
                        <div className="scenario-card__vat-group">
                            <div className="scenario-card__vat-toggle print-hidden">
                                <Checkbox
                                    id={`no-vat-${s.id}`}
                                    checked={s.noVat || false}
                                    onChange={(e) => onUpdate(s.id, 'noVat', e.target.checked)}
                                    label="Non assujetti TVA"
                                />
                            </div>
                            <ResultCard
                                title={
                                    <div className="scenario-card__vat-title">
                                        <span>TVA</span>
                                        {!s.noVat ? (
                                            <select
                                                value={s.tvaRate !== undefined ? s.tvaRate : TAX_CONFIG.TVA_STANDARD}
                                                onChange={(e) => onUpdate(s.id, 'tvaRate', parseFloat(e.target.value))}
                                                className="scenario-card__vat-select"
                                                aria-label={`Taux de TVA pour ${s.name}`}
                                            >
                                                <option value={0}>0%</option>
                                                <option value={0.055}>5.5%</option>
                                                <option value={0.10}>10%</option>
                                                <option value={0.20}>20%</option>
                                            </select>
                                        ) : (
                                            <span className="scenario-card__vat-zero">0%</span>
                                        )}
                                    </div>
                                }
                                value={FORMATTER.format(res.tva)}
                                type="neutral"
                            />
                        </div>
                        <ResultCard
                            title={s.noVat ? "Prix Total" : "TTC Client"}
                            value={FORMATTER.format(res.ttc)}
                            type="primary"
                        />
                    </div>
                    <div className="scenario-card__results-side">
                        <PriceBreakdown
                            cost={res.cost}
                            margin={res.marginEuro}
                            tva={res.tva}
                        />
                    </div>
                </div> */}

        <div className="scenario-card__details">
          <p className="scenario-card__details-title">Détails</p>
          <div className="scenario-card__details-row">
            <div className="scenario-card__details-item">
              <span className="scenario-card__details-label">
                Marge Brute Cible (HT)
              </span>
              <div className="scenario-card__details-control">
                <input
                  type="number"
                  value={res.marginEuro.toFixed(0)}
                  onChange={(e) => updateGlobalMarginEuro(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="scenario-card__details-input"
                  aria-label="Objectif de Marge Brute en Euros"
                  title="Modifiez pour recalculer automatiquement les prix ou les coûts"
                />
                <span className="scenario-card__details-unit">€</span>
              </div>
            </div>

            <div className="scenario-card__details-item">
              <span className="scenario-card__details-label">Marge Nette</span>
              <span
                className={`scenario-card__net-profit scenario-card__net-profit--${res.marginEuro >= 0 ? "positive" : "negative"}`}
              >
                {res.marginEuro >= 0 ? "+" : ""}
                {FORMATTER.format(res.marginEuro)}
              </span>
            </div>
          </div>

          <div className="scenario-card__health">
            <span className="scenario-card__health-label">
              Santé de la marge globale :
            </span>
            <div className="scenario-card__health-indicator">
              <div
                className={`scenario-card__health-dot scenario-card__health-dot--${marginHealth}`}
                aria-hidden="true"
              />
              <span
                className={`scenario-card__health-text scenario-card__health-text--${marginHealth}`}
              >
                {marginHealth === "good"
                  ? "Saine (≥ 40%)"
                  : marginHealth === "mid"
                    ? "Moyenne (20-40%)"
                    : "Critique (< 20%)"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* TJM Calculator Modal/Overlay should be absolute or fixed to the item */}
      {activeCalculator && (
        <div className="scenario-card__modal-backdrop">
          <div className="scenario-card__modal">
            <TJMCalculator
              initialValue={
                s.items.find((i) => i.id === activeCalculator.itemId)?.[
                  activeCalculator.field
                ] || 0
              }
              mode={activeCalculator.field === "cost" ? "cost" : "price"}
              onApply={(val) => {
                handleUpdateItem(
                  activeCalculator.itemId,
                  activeCalculator.field,
                  val,
                );
                setActiveCalculator(null);
              }}
              onClose={() => setActiveCalculator(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default ScenarioCard;
