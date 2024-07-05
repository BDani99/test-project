export async function fetchExchangeRates() {
  try {
    const response = await fetch(
      "/api/apps/backend/exchange-rate/exchange-rate-page?rateType=mkbk&fromDate=20240529&toDate=20240529&from=0&size=30"
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.exchangeRates;
  } catch (error) {
    throw new Error("Hiba a szerverrel való kommunikáció során");
  }
}
