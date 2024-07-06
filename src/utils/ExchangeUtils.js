export function calculateExchange(exchangeRates, fromCurrency, toCurrency, amount) {
    let exchangeResult = null;

    const fromRate = exchangeRates.find(rate => rate.currency === fromCurrency);
    const toRate = exchangeRates.find(rate => rate.currency === toCurrency);

    if (fromRate && toRate) {
        if (fromCurrency !== toCurrency) {
            const rate = fromRate.middleRate / toRate.middleRate;
            exchangeResult = (((amount * rate) / fromRate.unit) * toRate.unit).toFixed(4);
        } else {
            exchangeResult = amount.toFixed(2);
        }
    }

    return exchangeResult;
}
