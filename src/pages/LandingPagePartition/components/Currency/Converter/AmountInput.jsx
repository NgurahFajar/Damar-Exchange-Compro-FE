import React, {memo} from "react";
import CurrencyService from "@/services/Currency/CurrencyService.js";

export const AmountInput = memo(({ amount, fromCurrency, currencies, onChange, styles, t }) => {
    const selectedCurrency = currencies.find(c => c.currency_code === fromCurrency);
    const currencySymbol = selectedCurrency?.symbol || CurrencyService.getCurrencySymbol(fromCurrency);

    return (
        <div>
            <label className={`text-sm ${styles.mutedText} mb-1 block`}>{t('amount')}</label>
            <div className="relative flex items-center">
                {fromCurrency && (
                    <span className={`text-2xl font-semibold ${styles.text} mr-1`}>
                        {currencySymbol}
                    </span>
                )}
                <input
                    type="number"
                    value={amount}
                    onChange={onChange}
                    className={`w-full bg-transparent text-2xl font-semibold ${styles.text} outline-none`}
                    placeholder={t('amount_placeholder')}
                />
            </div>
        </div>
    );
});
