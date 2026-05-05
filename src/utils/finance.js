
export const TAX_CONFIG = {
    TVA_STANDARD: 0.20,
    IS_REDUIT: 0.15,
    IS_NORMAL: 0.25,
    SEUIL_IS: 42500
};

export const FORMATTER = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
});

export const PERCENT_FORMATTER = new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const pvFromCost = (cost, marginPercent) => {
    const c = parseFloat(cost) || 0;
    const m = parseFloat(marginPercent) || 0;
    if (c === 0 || m >= 100) return 0;
    return Math.round(c / (1 - m / 100));
};

export const costFromPv = (pv, marginPercent) => {
    const p = parseFloat(pv) || 0;
    const m = parseFloat(marginPercent) || 0;
    return Math.round(p * (1 - m / 100));
};

export const calculateResults = (s) => {
    let pv = parseFloat(s.pv) || 0;
    let cost = parseFloat(s.cost) || 0;
    let marginPercent = parseFloat(s.marginPercent) || 0;

    if (s.items && s.items.length > 0) {
        // In detailed mode, PV and Cost are sums of items
        pv = s.items.reduce((acc, item) => acc + (parseFloat(item.pv) || 0), 0);
        cost = s.items.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
        // Recalculate margin percent derived from totals
        marginPercent = pv !== 0 ? ((pv - cost) / pv) * 100 : 0;
    } else {
        // Standard modes
        if (s.mode === 'cost_percent') {
            pv = pvFromCost(cost, marginPercent);
        } else if (s.mode === 'pv_percent') {
            cost = costFromPv(pv, marginPercent);
        }
    }

    // Discount Calculation
    let discountAmount = 0;
    const discount = parseFloat(s.discount) || 0;
    const discountMode = s.discountMode || 'percent'; // 'percent' or 'euro'

    if (discount > 0) {
        if (discountMode === 'percent') {
            discountAmount = pv * (discount / 100);
        } else {
            discountAmount = discount;
        }
    }

    const finalPV = Math.max(0, pv - discountAmount);
    const marginEuro = finalPV - cost;
    const isNoVat = s.noVat === true;
    const tvaRate = isNoVat ? 0 : (s.tvaRate !== undefined ? parseFloat(s.tvaRate) : TAX_CONFIG.TVA_STANDARD);
    const tva = finalPV * tvaRate;

    // Calcul IS Progressif
    let is = 0;
    if (marginEuro > 0) {
        is = marginEuro <= TAX_CONFIG.SEUIL_IS
            ? marginEuro * TAX_CONFIG.IS_REDUIT
            : (TAX_CONFIG.SEUIL_IS * TAX_CONFIG.IS_REDUIT) + ((marginEuro - TAX_CONFIG.SEUIL_IS) * TAX_CONFIG.IS_NORMAL);
    }

    return {
        pv: finalPV,
        basePv: pv,
        cost,
        marginEuro,
        marginPercent: finalPV !== 0 ? (marginEuro / finalPV) : 0,
        tva,
        ttc: finalPV + tva,
        is,
        netProfit: marginEuro - is,
        discountAmount
    };
};
