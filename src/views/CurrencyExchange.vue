<template>
  <div class="container">
    <div v-if="exchangeRates !== null" class="exchange-form">
      <h1>Valutaváltás</h1>
      <div class="form-group">
        <label for="fromCurrency">Erről a valutáról</label>
        <select id="fromCurrency" v-model="fromCurrency">
          <option
            v-for="currency in exchangeRates.filter((c) => c.name)"
            :key="currency.currency"
            :value="currency.currency"
          >
            {{ currency.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Összeg</label>
        <input
          type="number"
          id="amount"
          v-model.number="amount"
          min="0"
          step="500"
        />
      </div>

      <div class="form-group">
        <label for="toCurrency">Ebben a valutában</label>
        <select id="toCurrency" v-model="toCurrency">
          <option
            v-for="currency in exchangeRates.filter((c) => c.name)"
            :key="currency.currency"
            :value="currency.currency"
          >
            {{ currency.name }}
          </option>
        </select>
      </div>

      <button @click="calculateExchange" class="calculate-btn">Mehet</button>

      <div class="result" :class="{ visible: exchangeResult !== null }">
        <p v-show="exchangeResult !== null">
          {{ amount }} {{ fromCurrency }} = {{ exchangeResult }}
          {{ toCurrency }}
        </p>
      </div>
    </div>

    <div v-else class="loading">
      <p v-if="error">{{ error }}</p>
      <p v-else>Betöltés...</p>
    </div>
  </div>
</template>

<script>
import { fetchExchangeRates } from "../api/api.js";
import { getLastWorkday } from "../utils/DateUtils.js";
import { calculateExchange } from "../utils/ExchangeUtils.js";

export default {
  data() {
    return {
      exchangeRates: null,
      fromCurrency: null,
      toCurrency: null,
      amount: null,
      exchangeResult: null,
      error: null,
    };
  },
  async mounted() {
    try {
      const lastWorkday = getLastWorkday();

      this.toDate = lastWorkday;
      this.fromDate = lastWorkday;

      this.exchangeRates = await fetchExchangeRates(this.fromDate, this.toDate);
    } catch (error) {
      this.error = "Hiba a szerverrel való kommunikáció során";
    }
  },
  watch: {
    fromCurrency() {
      this.exchangeResult = null;
    },
    toCurrency() {
      this.exchangeResult = null;
    },
    amount() {
      this.exchangeResult = null;
    },
  },
  methods: {
    calculateExchange() {
      this.exchangeResult = calculateExchange(
        this.exchangeRates,
        this.fromCurrency,
        this.toCurrency,
        this.amount
      );
    },
  },
};
</script>

<style scoped src='../styles/CurrencyExchange.css'></style>
