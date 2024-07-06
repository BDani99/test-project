export async function fetchExchangeRates(fromDate, toDate, size=18) {
  const formattedFromDate = fromDate.replace(/-/g, '');
  const formattedToDate = toDate.replace(/-/g, '');
  try {
    const response = await fetch(
      `/api/apps/backend/exchange-rate/exchange-rate-page?rateType=mkbk&fromDate=${formattedFromDate}&toDate=${formattedToDate}&from=0&size=${size}`
    );
    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Network response was not ok: ${errorDetail}`);
    }
    const data = await response.json();
    console.log(data)
    return data.exchangeRates;
  } catch (error) {
    console.error("Hiba a szerverrel való kommunikáció során:", error);
    throw new Error("Hiba a szerverrel való kommunikáció során");
  }
}
