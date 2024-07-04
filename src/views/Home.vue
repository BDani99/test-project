<template>
  <div>
    <h2>Valuta árfolyamok</h2>

    <div v-if="exchangeRates" class="container">
      <div class="wrapper">
        <ExchangeRateTable :exchange-rates="exchangeRates" />
        <ExchangeRateChart :exchange-rates="exchangeRates" />
      </div>
    </div>

    <div v-else>
      <p>Betöltés...</p>
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
    };
  },
  async mounted() {
    try {
      this.exchangeRates = await fetchExchangeRates();
      console.log("Exchange rates:", this.exchangeRates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  },
};
</script>

<style>
.container {
  width: 100%;
  height: 82vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  width: 95%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
}

.wrapper::-webkit-scrollbar {
  display: none;
}
</style>
