<template>
  <div>
    <h1>Valuta árfolyamok</h1>

    <div v-if="exchangeRates" class="container">
      <ExchangeRateTable
        :exchange-rates="exchangeRates"
        @currency-selected="handleCurrencySelected"
      />

      <div class="diagram-container">
        <ExchangeRateChart
          :selected-currency="selectedCurrency"
          :exchange-rates="filteredExchangeRates"
          :from-date="fromDate"
          :to-date="toDate"
          @fetch-data="fetchData"
        />
      </div>
    </div>

    <div v-else>
      <p v-if="error">{{ error }}</p>
      <p v-else>Betöltés...</p>
    </div>
  </div>
</template>

<script>
import ExchangeRateTable from "../components/ExchangeRateTable.vue";
import ExchangeRateChart from "../components/ExchangeRateChart.vue";
import { fetchExchangeRates } from "../api/api.js";
import { getYesterday, calculateDateDifference } from "../utils/DateUtils.js";

export default {
  components: {
    ExchangeRateTable,
    ExchangeRateChart,
  },
  data() {
    return {
      exchangeRates: null,
      selectedCurrency: "",
      error: null,
      fromDate: "",
      toDate: "",
      selectedCurrencyRates: [],
    };
  },
  async mounted() {
    try {
      const yesterday = getYesterday();

      this.toDate = yesterday;
      this.fromDate = yesterday;

      this.exchangeRates = await fetchExchangeRates(this.fromDate, this.toDate);
    } catch (error) {
      this.error = "Hiba a szerverrel való kommunikáció során";
    }
  },
  methods: {
    handleCurrencySelected(currency) {
      this.selectedCurrency = currency;
      this.updateSelectedCurrencyRates();
    },
    async fetchData(fromDate, toDate) {
      if (!fromDate || !toDate || !this.selectedCurrency) return;

      try {
        const diffDays = calculateDateDifference(fromDate, toDate);

        const dailyDataCount = 18;
        const size = diffDays * dailyDataCount;

        const exchangeRates = await fetchExchangeRates(fromDate, toDate, size);

        this.selectedCurrencyRates = exchangeRates
          .filter((rate) => rate.currency === this.selectedCurrency)
          .map((rate) => ({
            ...rate,
            sellRate: rate.salesRate,
            buyRate: rate.buyRate,
          }));
      } catch (error) {
        console.error("Hiba a szerverrel való kommunikáció során:", error);
      }
    },
    updateSelectedCurrencyRates() {
      if (!this.selectedCurrency) return;

      this.selectedCurrencyRates = this.exchangeRates.filter(
        (rate) => rate.currency === this.selectedCurrency
      );
    },
  },
  computed: {
    filteredExchangeRates() {
      return this.selectedCurrencyRates;
    },
  },
};
</script>

<style scoped src='../styles/Home.css'></style>
