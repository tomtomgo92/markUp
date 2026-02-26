
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
            pv = cost !== 0 ? Math.round(cost / (1 - (marginPercent / 100))) : 0;
        } else if (s.mode === 'pv_percent') {
            cost = Math.round(pv * (1 - (marginPercent / 100)));
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
    const tva = finalPV * TAX_CONFIG.TVA_STANDARD;

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
