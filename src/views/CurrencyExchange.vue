<template>
  <div>
    <h1>Valutaváltás</h1>

    <div v-if="exchangeRates">
      <div>
        <label for="fromCurrency">Kiinduló valuta:</label>
        <select id="fromCurrency" v-model="fromCurrency">
          <option
            v-for="currency in exchangeRates"
            :key="currency.currency"
            :value="currency.currency"
          >
            {{ currency.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="toCurrency">Célpont valuta:</label>
        <select id="toCurrency" v-model="toCurrency">
          <option
            v-for="currency in exchangeRates"
            :key="currency.currency"
            :value="currency.currency"
          >
            {{ currency.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="amount">Átváltandó összeg:</label>
        <input
          type="number"
          id="amount"
          v-model.number="amount"
          min="0"
          step="0.01"
        />
      </div>

      <button @click="calculateExchange">Számol</button>

      <div v-if="exchangeResult !== null">
        <p>
          {{ amount }} {{ fromCurrency }} = {{ exchangeResult }}
          {{ toCurrency }}
        </p>
      </div>
    </div>

    <div v-else>
      <p>Betöltés...</p>
    </div>
  </div>
</template>

<script>
import { fetchExchangeRates } from "../api/api.js";

export default {
  data() {
    return {
      exchangeRates: null,
      fromCurrency: null,
      toCurrency: null,
      amount: 1,
      exchangeResult: null,
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
  methods: {
    calculateExchange() {
      const fromRate = this.exchangeRates.find(
        (rate) => rate.currency === this.fromCurrency
      );
      const toRate = this.exchangeRates.find(
        (rate) => rate.currency === this.toCurrency
      );

      if (fromRate && toRate) {
        const rate = toRate.middleRate / fromRate.middleRate;
        this.exchangeResult = (this.amount * rate).toFixed(2);
      } else {
        this.exchangeResult = null;
      }
    },
  },
};
</script>

<style>
</style>
