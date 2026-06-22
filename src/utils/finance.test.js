import { describe, it, expect } from 'vitest';
import { pvFromCost, costFromPv, calculateResults } from './finance';

// ─── pvFromCost ──────────────────────────────────────────────────────────────

describe('pvFromCost', () => {
    it('calcule le PV depuis le coût et la marge', () => {
        // cost=800, margin=20% → pv = 800 / (1 - 0.2) = 1000
        expect(pvFromCost(800, 20)).toBe(1000);
    });
    it('retourne 0 si le coût est 0', () => {
        expect(pvFromCost(0, 30)).toBe(0);
    });
    it('retourne 0 si la marge est 100%', () => {
        expect(pvFromCost(500, 100)).toBe(0);
    });
    it('accepte des valeurs en string (parseFloat)', () => {
        expect(pvFromCost('800', '20')).toBe(1000);
    });
    it('arrondit au nombre entier le plus proche', () => {
        // cost=100, margin=33% → 100/0.67 ≈ 149.25 → arrondi à 149
        expect(pvFromCost(100, 33)).toBe(149);
    });
});

// ─── costFromPv ──────────────────────────────────────────────────────────────

describe('costFromPv', () => {
    it('calcule le coût depuis le PV et la marge', () => {
        // pv=1000, margin=30% → cost = 1000 * (1 - 0.3) = 700
        expect(costFromPv(1000, 30)).toBe(700);
    });
    it('retourne 0 si le PV est 0', () => {
        expect(costFromPv(0, 30)).toBe(0);
    });
    it('retourne le PV lui-même si la marge est 0%', () => {
        expect(costFromPv(1000, 0)).toBe(1000);
    });
    it('retourne 0 si la marge est 100%', () => {
        expect(costFromPv(1000, 100)).toBe(0);
    });
    it('accepte des valeurs en string', () => {
        expect(costFromPv('1000', '30')).toBe(700);
    });
});

// ─── calculateResults — mode pv_cost ────────────────────────────────────────

describe('calculateResults — mode pv_cost', () => {
    const base = { mode: 'pv_cost', pv: 1000, cost: 700, marginPercent: 30, items: [] };

    it('calcule la marge en euros', () => {
        expect(calculateResults(base).marginEuro).toBe(300);
    });
    it('calcule marginPercent comme ratio (0.3)', () => {
        expect(calculateResults(base).marginPercent).toBeCloseTo(0.3);
    });
    it('calcule la TVA à 20% par défaut', () => {
        expect(calculateResults(base).tva).toBeCloseTo(200);
    });
    it('calcule le TTC = PV + TVA', () => {
        expect(calculateResults(base).ttc).toBeCloseTo(1200);
    });
});

// ─── calculateResults — mode cost_percent ───────────────────────────────────

describe('calculateResults — mode cost_percent', () => {
    it('dérive le PV depuis coût + marge%', () => {
        // cost=800, margin=20% → pv = 1000
        const s = { mode: 'cost_percent', pv: 0, cost: 800, marginPercent: 20, items: [] };
        expect(calculateResults(s).pv).toBe(1000);
    });
    it('garde le coût inchangé', () => {
        const s = { mode: 'cost_percent', pv: 0, cost: 800, marginPercent: 20, items: [] };
        expect(calculateResults(s).cost).toBe(800);
    });
    it('retourne pv=0 si le coût est 0', () => {
        const s = { mode: 'cost_percent', pv: 0, cost: 0, marginPercent: 30, items: [] };
        expect(calculateResults(s).pv).toBe(0);
    });
});

// ─── calculateResults — mode pv_percent ─────────────────────────────────────

describe('calculateResults — mode pv_percent', () => {
    it('dérive le coût depuis PV + marge%', () => {
        // pv=1000, margin=30% → cost = 700
        const s = { mode: 'pv_percent', pv: 1000, cost: 0, marginPercent: 30, items: [] };
        expect(calculateResults(s).cost).toBe(700);
    });
    it('garde le PV inchangé', () => {
        const s = { mode: 'pv_percent', pv: 1000, cost: 0, marginPercent: 30, items: [] };
        expect(calculateResults(s).pv).toBe(1000);
    });
});

// ─── Remise commerciale ──────────────────────────────────────────────────────

describe('calculateResults — remise', () => {
    const base = { mode: 'pv_cost', pv: 1000, cost: 600, items: [] };

    it('applique une remise en pourcentage', () => {
        const s = { ...base, discount: 10, discountMode: 'percent' };
        const res = calculateResults(s);
        expect(res.discountAmount).toBeCloseTo(100);
        expect(res.pv).toBeCloseTo(900);
    });
    it('applique une remise en euros', () => {
        const s = { ...base, discount: 200, discountMode: 'euro' };
        const res = calculateResults(s);
        expect(res.discountAmount).toBe(200);
        expect(res.pv).toBe(800);
    });
    it('bloque le PV final à 0 si la remise dépasse le PV', () => {
        const s = { ...base, discount: 1500, discountMode: 'euro' };
        expect(calculateResults(s).pv).toBe(0);
    });
    it('marge négative quand remise > PV (coût non affecté)', () => {
        const s = { ...base, discount: 1500, discountMode: 'euro' };
        expect(calculateResults(s).marginEuro).toBe(-600);
    });
    it('aucune remise quand discount = 0', () => {
        const res = calculateResults({ ...base, discount: 0 });
        expect(res.discountAmount).toBe(0);
        expect(res.pv).toBe(1000);
    });
});

// ─── TVA ─────────────────────────────────────────────────────────────────────

describe('calculateResults — TVA', () => {
    const base = { mode: 'pv_cost', pv: 1000, cost: 700, items: [] };

    it('applique 20% par défaut (tvaRate absent)', () => {
        expect(calculateResults(base).tva).toBeCloseTo(200);
    });
    it('applique le taux réduit 5.5%', () => {
        expect(calculateResults({ ...base, tvaRate: 0.055 }).tva).toBeCloseTo(55);
    });
    it('applique le taux intermédiaire 10%', () => {
        expect(calculateResults({ ...base, tvaRate: 0.10 }).tva).toBeCloseTo(100);
    });
    it('TVA = 0 quand noVat = true', () => {
        const res = calculateResults({ ...base, noVat: true });
        expect(res.tva).toBe(0);
        expect(res.ttc).toBe(res.pv);
    });
    it('noVat écrase tvaRate', () => {
        expect(calculateResults({ ...base, noVat: true, tvaRate: 0.20 }).tva).toBe(0);
    });
});

// ─── Mode détaillé (items) ───────────────────────────────────────────────────

describe('calculateResults — mode détaillé (items)', () => {
    it('additionne les PV et coûts des lignes, ignore les valeurs globales', () => {
        const s = {
            mode: 'pv_cost',
            pv: 9999, cost: 9999, marginPercent: 0,
            items: [
                { id: 1, pv: 600, cost: 400 },
                { id: 2, pv: 400, cost: 300 },
            ],
        };
        const res = calculateResults(s);
        expect(res.basePv).toBe(1000);
        expect(res.cost).toBe(700);
        expect(res.marginEuro).toBe(300);
    });
    it('recalcule marginPercent depuis les totaux des lignes', () => {
        const s = {
            mode: 'pv_cost', pv: 0, cost: 0, marginPercent: 0,
            items: [{ id: 1, pv: 1000, cost: 750 }],
        };
        expect(calculateResults(s).marginPercent).toBeCloseTo(0.25);
    });
    it('items[] vide → comportement mode standard', () => {
        const s = { mode: 'pv_cost', pv: 500, cost: 300, marginPercent: 0, items: [] };
        expect(calculateResults(s).pv).toBe(500);
    });
});

// ─── Cas limites ─────────────────────────────────────────────────────────────

describe('calculateResults — cas limites', () => {
    it('pv=0 et cost=0 → marginPercent=0, tva=0', () => {
        const res = calculateResults({ mode: 'pv_cost', pv: 0, cost: 0, items: [] });
        expect(res.marginPercent).toBe(0);
        expect(res.tva).toBe(0);
    });
    it('cost=0 en mode pv_cost → marge pleine', () => {
        const res = calculateResults({ mode: 'pv_cost', pv: 1000, cost: 0, items: [] });
        expect(res.marginEuro).toBe(1000);
    });
    it('marge négative → marginEuro négatif', () => {
        const res = calculateResults({ mode: 'pv_cost', pv: 300, cost: 500, items: [] });
        expect(res.marginEuro).toBeLessThan(0);
    });
    it('marginPercent=0 en cost_percent → pv = cost (marge zéro)', () => {
        const res = calculateResults({ mode: 'cost_percent', pv: 0, cost: 1000, marginPercent: 0, items: [] });
        expect(res.pv).toBe(1000);
        expect(res.marginEuro).toBe(0);
    });
});
