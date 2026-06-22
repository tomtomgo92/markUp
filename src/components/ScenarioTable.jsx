import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@thatmuch/designsystem';
import ScenarioItemRow from './ScenarioItemRow';
import './ScenarioTable.css';

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
    onUpdateItem,
    onRemoveItem,
    onOpenCalculator,
    onAddItem,
    results
}) => {
    return (
        <div className="scenario-table">
            <table className="scenario-table__table">
                <thead className="scenario-table__head">
                    <tr>
                        <th className="scenario-table__th scenario-table__th--index">#</th>
                        <th className="scenario-table__th">Libellé</th>
                        <th className="scenario-table__th">Coût</th>
                        <th className="scenario-table__th">PV</th>
                        <th className="scenario-table__th scenario-table__th--right">Marge</th>
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
                                    <p className="scenario-table__empty-text">Commencez par ajouter des éléments à chiffrer</p>
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
                            <td className="scenario-table__total-label" colSpan="2">Total</td>
                            <td className="scenario-table__total-value">{results.cost.toFixed(2)}€</td>
                            <td className="scenario-table__total-value">{results.pv.toFixed(2)}€</td>
                            <td className="scenario-table__total-margin">{(results.pv - results.cost).toFixed(2)}€</td>
                            <td></td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default ScenarioTable;
