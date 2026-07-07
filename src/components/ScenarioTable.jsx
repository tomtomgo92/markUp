import "./ScenarioTable.css";

import { Button, Tooltip } from "@thatmuch/designsystem";
import { Info, Plus } from "lucide-react";

import React from "react";
import ScenarioItemRow from "./ScenarioItemRow";

/**
 * ScenarioTable - Displays the list of items in a scenario with calculation results
 *
 * @param {Object} props
 * @param {Array} props.items - List of items in the scenario
 * @param {string} props.mode - Calculation mode ('pv_cost', 'cost_percent', 'pv_percent')
 * @param {Function} props.onUpdateItem - Handler for item updates
 * @param {Function} props.onRemoveItem - Handler for item removal
 * @param {Function} props.onOpenCalculator - Handler for opening TJM calculator
 * @param {Function} props.onAddItem - Handler for adding a new item
 * @param {Object} props.results - Calculated results (pv, cost)
 */
const ScenarioTable = ({
  items,
  mode,
  noVat = false,
  onUpdateItem,
  onRemoveItem,
  onOpenCalculator,
  onAddItem,
  results,
}) => {
  const tvaCost = results.cost * 0.2;
  const tvaPv = results.pv * 0.2;
  const totalCost = (results.cost + tvaCost).toFixed(2);
  const totalPv = (results.pv + tvaPv).toFixed(2);
  const totalMargin = (results.pv - results.cost).toFixed(2);
  const tvaMargin = (tvaPv - tvaCost).toFixed(2);
  const totalMarginTTC = (totalMargin - tvaMargin).toFixed(2);

  return (
    <div className="scenario-table">
      <table className="scenario-table__table">
        <thead className="scenario-table__head">
          <tr>
            <th className="scenario-table__th scenario-table__th--index">#</th>
            <th className="scenario-table__th">Libellé</th>
            <th className="scenario-table__th">Coût</th>
            <th className="scenario-table__th">PV</th>
            <th className="scenario-table__th scenario-table__th--right">
              Marge
            </th>
            <th className="scenario-table__th scenario-table__th--index print-hidden"></th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, i) => (
            <ScenarioItemRow
              key={item.id}
              item={item}
              index={i}
              mode={mode}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
              onOpenCalculator={onOpenCalculator}
              onAddItem={onAddItem}
            />
          ))}
          {(!items || items.length === 0) && (
            <tr>
              <td colSpan="6" className="scenario-table__empty">
                <div className="scenario-table__empty-content">
                  <p className="scenario-table__empty-text">
                    Commencez par ajouter des éléments à chiffrer
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon={<Plus size={16} />}
                    onClick={onAddItem}
                  >
                    Ajouter une ligne
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        {items && items.length > 0 && (
          <tfoot className="scenario-table__foot">
            <tr>
              <td className="scenario-table__total-label" colSpan="2">
                Total HT
              </td>
              <td className="scenario-table__total-value">
                {results.cost.toFixed(2)}€
              </td>
              <td className="scenario-table__total-value">
                <div className="scenario-table__total-value-wrap">
                  {results.pv.toFixed(2)}€
                  <Tooltip label="Prix à annoncer au client">
                    <Info size={16} />
                  </Tooltip>
                </div>
              </td>
              <td className="scenario-table__total-margin">
                {(results.pv - results.cost).toFixed(2)}€
              </td>
              <td></td>
            </tr>
            {!noVat && (
              <>
                <tr>
                  <td className="scenario-table__total-label" colSpan="2">
                    TVA (20%)
                  </td>
                  <td className="scenario-table__total-value">
                    {tvaCost.toFixed(2)}€
                  </td>
                  <td className="scenario-table__total-value">
                    {tvaPv.toFixed(2)}€
                  </td>
                  <td className="scenario-table__total-margin">{tvaMargin}€</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="scenario-table__total-label" colSpan="2">
                    Total TTC
                  </td>
                  <td className="scenario-table__total-value">{totalCost}€</td>
                  <td className="scenario-table__total-value">{totalPv}€</td>
                  <td className="scenario-table__total-margin">
                    {totalMarginTTC}€
                  </td>
                  <td></td>
                </tr>
              </>
            )}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default ScenarioTable;
