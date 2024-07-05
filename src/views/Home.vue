<template>
  <div>
    <h1>Valuta árfolyamok</h1>

    <div v-if="exchangeRates" class="container">
      <div class="wrapper">
        <ExchangeRateTable
          :exchange-rates="exchangeRates"
          @currency-selected="handleCurrencySelected"
        />
      </div>

      <div class="diagram-container">
        <ExchangeRateChart :exchange-rates="selectedCurrencyData" />
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
    };
  },
  async mounted() {
    try {
      this.exchangeRates = await fetchExchangeRates();
    } catch (error) {
      this.error = "Hiba a szerverrel való kommunikáció során";
    }
  },
  methods: {
    handleCurrencySelected(currency) {
      this.selectedCurrency = currency;
    },
  },
  computed: {
    selectedCurrencyData() {
      if (!this.exchangeRates || !this.selectedCurrency) return [];
      return this.exchangeRates.filter(
        (rate) => rate.currency === this.selectedCurrency
      );
    },
  },
};
</script>

<style scoped>
.container {
  flex-direction: column;
  width: 100%;
  height: 110vh;
  min-height: 850px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.diagram-container {
  margin-top: 30px;
  width: 100%;
}

.wrapper {
  width: 95%;
  height: 100%;
  overflow-y: auto;
}

.wrapper::-webkit-scrollbar {
  width: 10px;
}

.wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
